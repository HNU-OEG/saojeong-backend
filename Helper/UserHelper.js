const pool = require('../config/db')
const fs = require('fs').promises
const path = require('path')
const jwt = require('jsonwebtoken')
const randToken = require('rand-token')
const momemt = require('moment')
const { access } = require('fs')
const fetch = require('node-fetch')

module.exports = {
  checkUserAvailablebyMemberID: async (member_id) => {
    try {
      let [result] = await pool.query('select member_id from users where member_id = ?', [member_id])
      if (result.length == 0) {
        return false
      } else {
        return true
      }
    } catch (err) {
      console.log(err)
      throw new Error('MemberID를 조회하는 중에 오류가 발생하였습니다.')
    }
  },
  generateGuestNickname: async () => {

    try {
      const result = await fs.readFile(path.join(__dirname, 'dictionary.txt'), 'utf8')
      var d = result.split('\n')
      var item = d[Math.floor(Math.random() * d.length)]
      nickname = '익명의 ' + item
      return nickname
    } catch (e) {
      console.error(e)
    }
  },
  claimJWTAccessToken: async (payload) => {
    // FIXME: CHANGE TOKEN EXPIRY IN PRODUCTION!!!!!!!
    let base_payload = {
      iss: 'team.Ojeongdong.Economics.Guardians',
      exp: Math.floor(Date.now() / 1000) + 1296000,
      ...payload,
    }

    console.log(base_payload)

    try {
      let result = await jwt.sign(JSON.stringify(base_payload), process.env.JWT_SECRET)
      return result
    } catch (err) {
      console.log(err)
      throw new Error('JWT 발급 중 오류 발생.')
    }
  },
  claimAccessTokenByMemberId: async (member_id) => {

    try {
      let [result] = await pool.query('select member_id, nickname, type from users where member_id=?', [member_id])
      let payload = {
        member_id: result[0].member_id,
        nickname: result[0].nickname,
        usertype: result[0].type,
      }
      let accessToken = await module.exports.claimJWTAccessToken(payload)
      return accessToken
    } catch (err) {
      throw new Error('Member ID 로 JWT Refresh 토큰 생성 중 오류 발생.')
    }
  },
  // 최초 사용자 
  claimJWTRefreshToken_firstuser: async (member_id) => {
    let refresh_token = randToken.generate(256)
    let provider = 'JWT'
    let oauth_version = '1.0'
    let expiry_date = momemt().add(+180, 'days').format('YYYY-MM-DD HH:mm:ss')
    try {
      let claimJWTToken = await pool.execute('insert into oauth_id (member_id, provider, oauth_version, refresh_token, expired_at) values (?,?,?,?,?)', [member_id, provider, oauth_version, refresh_token, expiry_date])
      return refresh_token
    } catch (err) {
      console.log(err)
      throw new Error('최소 사용자의 JWT Refresh 토큰 생성 중 오류 발생.')
    }
  },
  claimJWTRefreshToken: async (member_id, oldToken) => {
    let user_member_id = member_id
    let provider = 'JWT'
    let oauth_version = '1.0'
    let expiry_date = momemt().add(+180, 'days').format('YYYY-MM-DD HH:mm:ss')

    try {
      let refresh_token = randToken.generate(256)
      let [old_token] = await pool.query('select id, refresh_token, is_activated from oauth_id where is_activated = 1 and member_id = ?', [member_id])
      // 사용자가 가지고 있는 refresh token과 현재 db의 refresh token이 일치하는지 확인
      if (old_token[0].refresh_token == oldToken) {
        // 일치하면 이전의 refresh token을 블럭하고 새로운 refresh token 발급 및 리턴
        let claimJWTToken = await pool.execute('insert into oauth_id (member_id, provider, oauth_version, refresh_token, expired_at) values (?,?,?,?,?)', [user_member_id, provider, oauth_version, refresh_token, expiry_date])
        let revokeOldToken = await pool.execute('update oauth_id set is_activated = 0 where id = ? and provider="JWT"', [old_token[0].id])
        return refresh_token
      } else {
        return 0
      }
    } catch (err) {
      console.log(err)
      throw new Error('JWT Refresh 토큰 발급 중 오류 발생.')
    }
  },
  claimJWTRefreshTokenForcefully: async (member_id) => {
    let user_member_id = member_id
    let provider = 'JWT'
    let oauth_version = '1.0'
    let expiry_date = momemt().add(+180, 'days').format('YYYY-MM-DD HH:mm:ss')

    try {
      let refresh_token = randToken.generate(256)
      let revokeOldToken = await pool.execute('update oauth_id set is_activated = 0 where member_id = ? and provider="JWT"', [member_id])
      let claimJWTToken = await pool.execute('insert into oauth_id (member_id, provider, oauth_version, refresh_token, expired_at) values (?,?,?,?,?)', [user_member_id, provider, oauth_version, refresh_token, expiry_date])
      return refresh_token
    } catch (err) {
      console.log(err)
      throw new Error('JWT Refresh 토큰 발급 중 오류 발생.')
    }
  },
  claimNewSocialLoginJWTToken: async (username, nickname, email, gender, ipaddr, provider, provider_version, accessToken, refreshToken, type = 1) => {
    let data = {
      id: randToken.suid(20), //
      username: username, // 사용자 고유 식별 id //
      nickname: nickname, // 
      email: email || null, //
      type: type, //
      gender: gender || null, //
      enabled: 1,
      ipaddr: ipaddr,
      provider: provider,
      provider_version: provider_version,
      accessToken: accessToken || null,
      refreshToken: refreshToken || null
    }

    if (provider == 'Facebook') {
      data.refreshToken = await module.exports.claimFacebookRefreshToken(accessToken)
    }

    let user = await module.exports.saveNewUserByOAuth(data.id, data.username, data.email, data.nickname, data.type, gender)
    let oauth = await module.exports.saveNewOAuthInfo(data.id, data.provider, data.provider_version, data.accessToken, data.refreshToken)

    try {

      const [result] = await pool.query('select id, member_id, username, nickname, gender, created_at, type from users where id=?', [user[0].insertId])


      console.log(result)


      let jwtpayload_data = {
        reference_id: result[0].id || null,
        member_id: result[0].member_id,
        nickname: result[0].nickname,
        usertype: result[0].type
      }
      const refreshToken = await module.exports.claimJWTRefreshToken_firstuser(jwtpayload_data.member_id)
      const token = await module.exports.claimJWTAccessToken(jwtpayload_data)
      console.log(token)
      return { result, 'AccessToken': token, 'RefreshToken': refreshToken }
    } catch (err) {
      console.log(err)
      throw new Error('소셜로그인 JWT 사용자 생성 중 오류 발생', err)
    }
  },
  claimFacebookRefreshToken: async (facebook_access_token) => {
    var url = new URL('https://graph.facebook.com/v7.0/oauth/access_token')

    var params = {
      grant_type: 'fb_exchange_token',
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      fb_exchange_token: facebook_access_token
    }
    url.search = new URLSearchParams(params).toString()

    let response = await fetch(url)
    let result = await response.json()
    console.log('result :>> ', result)
    return result.access_token
  },
  checkUserStatus: async (member_id) => {
    try {
      let [user] = await pool.query('select users.member_id, users.enabled from users where enabled = 1 and member_id = ?', [member_id])
      if (user.length == 0) {
        return false
      } else {
        return true
      }
    } catch (err) {
      throw new Error('UserID 조회 중 오류 발생')
    }
  },
  checkUserAuthenticatedAvailability: async (member_id) => {
    try {
      let user = await pool.query('select users.member_id, users.enabled, refresh_token, oauth_id.is_activated, oauth_id.expired_at from users, oauth_id where users.member_id = oauth_id.member_id and users.member_id = ? order by expired_at desc limit 1', [member_id])
      if (user[0].is_activated == 0) {
        return false
      } else {
        return true
      }
    } catch (err) {
      throw new Error('유저 조회 중 오류 발생')
    }
  },
  RevokeUserOAuthStatus: async (member_id) => {
    try {
      let user = await pool.execute('update oauth_id set is_activated = 0 where member_id = ?', [member_id])
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  },
  RemoveUser: async (member_id) => {
    try {
      let user = await pool.execute('update users set enabled = 0 where member_id = ?', [member_id])
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  },
  checkUserNickname: async (member_id) => {
    try {
      let [username] = await pool.query('select member_id, nickname from users where member_id = ?', [member_id])
      if (username.length == 1) {
        return username[0].nickname
      } else {
        return false
      }
    } catch (err) {
      throw new Error('User Nickname 조회에 실패했습니다.')
    }
  },
  getLatestUpdateReferenceId: async (member_id) => {
    try {
      let [ref_id] = await pool.query('select id from users where member_id = ? order by id desc limit 1', [member_id])
      if (ref_id.length == 1) {
        return ref_id[0].id
      } else {
        return false
      }
    } catch (err) {
      throw new Error('Latest Ref ID 를 조회하지 못했습니다.')
    }
  },
  saveNewUserByOAuth: async (member_id, username, email, nickname, type, gender = null) => {
    try {
      let save_userdata = await pool.execute('insert into users (member_id, username, email, nickname, type, gender) values (?,?,?,?,?,?)', [member_id, username, email, nickname, type, gender])
      return save_userdata
    } catch (err) {
      console.error('Error :>> ', err)
      throw new Error('OAuth 인증을 통한 새로운 유저 작성 중 오류가 발생했습니다.')
    }
  },
  saveNewUserByOAuthKakao: async (member_id, username, email, nickname, type, gender) => {
    try {
      let save_userdata = await pool.execute('insert into users (member_id, username, email, nickname, type, gender) values (?,?,?,?,?,?)', [member_id, username, email, nickname, type, gender])
      return save_userdata
    } catch (err) {
      console.error('Error :>> ', err)
      throw new Error('OAuth 인증을 통한 새로운 유저 작성 중 오류가 발생했습니다.')
    }
  },
  saveNewOAuthInfo: async (member_id, provider, oauth_version, access_token, refresh_token) => {
    try {
      let save_oauth_info = await pool.execute('insert into oauth_id (member_id, provider, oauth_version, access_token, refresh_token) values (?,?,?,?,?)', [member_id, provider, oauth_version, access_token, refresh_token])
      return save_oauth_info
    } catch (err) {
      console.error('Error :>> ', err)
      throw new Error('OAuth 인증을 통한 인증정보 저장에 실패했습니다.')
    }
  },
  editUserImage: async (data) => {
    let image = data.image
    let member_id = data.member_id
    try {
      let edit = await pool.execute(
        'UPDATE users SET user_image = ? WHERE member_id = ?',
        [image, member_id]
      )

      let [response] = await pool.query(
        'SELECT member_id, nickname, user_image AS image FROM `users` WHERE `member_id` = ?',
        [member_id]
      )

      console.log('프로필 이미지 수정 완료: ', response[0])
      return response[0]
    } catch (e) {
      console.log('프로필 이미지 수정 중 오류 발생', e)
      throw new Error('프로필 이미지 수정 중 오류 발생\n', e)
    }
  },
  getEditUserImageDto: async (req) => {
    return {
      'member_id': req.user.member_id,
      'image': req.file.location,
    }
  },
}