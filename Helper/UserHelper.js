const pool = require('../config/db')
const fs = require('fs').promises
const path = require('path')
const jwt = require('jsonwebtoken')
const randToken = require('rand-token')
const momemt = require('moment')

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
        let revokeOldToken = await pool.execute('update oauth_id set is_activated = 0 where id = ?', [old_token[0].id])
        return refresh_token
      } else {
        return 0
      }
    } catch (err) {
      console.log(err)
      throw new Error('JWT Refresh 토큰 발급 중 오류 발생.')
    }
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
  }
}