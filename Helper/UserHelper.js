const pool = require('../config/db')
const fs = require('fs').promises
const path = require('path')
const jwt = require('jsonwebtoken')
const randToken = require('rand-token')
const momemt = require('moment')
const fetch = require('node-fetch')
const _ = require('lodash')
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
    var names = ['가면팜사향고양이', '가시두더지', '가젤영양', '가지뿔영양', '갈기늑대', '갈기쥐', '갈라파고스물개', '갈라파고스펭귄', '갈색여우원숭이', '강멧돼지', '개', '개미핥기', '개코원숭이', '거농원숭이', '거미원숭이', '검둥원숭이', '검은고함원숭이', '검은머리꼬리감기원숭이', '검은수염고래', '검은여우원숭이', '게잡이물범', '게잡이원숭이', '고라니', '고래', '고릴라', '고슴도치', '고양이', '고함원숭이', '곰', '관여우원숭이', '관박쥐', '귀신고래', '그랜트가젤', '그랜트얼룩말', '그레비얼룩말', '그레이하운드', '그리슨족제비', '금강산코박쥐', '기린', '긴귀주머니오소리', '긴칼뿔오릭스', '긴팔원숭이', '꼬리감기원숭이', '꿀먹이박쥐', '나무늘보', '낙타', '날다람쥐', '날쥐', '남극물개', '남방바다사자', '남방큰돌고래', '낫돌고래', '너구리', '네발가락고슴도치', '네뿔영양', '노란눈썹펭귄', '노란머리큰박쥐', '노루', '눈토끼', '뉴질랜드물개', '느림보늘보원숭이', '늘보곰', '늘보원숭이', '늘보주머니쥐', '늪영양', '늑대', '다람쥐', '다람쥐원숭이', '다마가젤', '다이커영양', '단봉낙타', '담비', '당나귀', '대륙담비 ', '덤불멧돼지', '도르카스가젤', '동부회색청서', '돌고래', '돌산양', '돼지', '돼지사슴', '두더지', '두크마른원숭이', '뒤쥐', '등줄쥐', '딩고', '땃쥐', '뚱뚱꼬리저빌', '라마', '로키산양 ', '마른원숭이', '마모셋원숭이', '마카크원숭이', '마코르염소', '말', '망토개코원숭이', '멧돼지', '멧토끼', '몽구스여우원숭이', '물개', '물영양', '미슈미타킨', '바다사자', '바다표범', '바르바리양', '바르바리마카크', '바비루사', '바위너구리', '박쥐', '반달가슴곰', '버마고양이', '범고래', '베르베트원숭이', '벵골호랑이', '봉고', '부탄타킨', '북극곰', '북극여우', '불곰', '불독', '불테리어', '붉은고함원숭이', '붉은목도리여우원숭이', '붉은여우', '붉은박쥐', '비단원숭이', '비버', '비쿠냐', '사막여우', '사슴', '사자', '사자꼬리마카크원숭이', '사향고양이', '사향노루', '산양', '산토끼', '삵', '상괭이', '생쥐', '샴고양이', '셰퍼드', '소', '솜머리비단원숭이', '수달', '수염고래', '스라소니', '스컹크', '시베리아호랑이', '시베리안 허스키', '시파카원숭이', '쓰촨타킨', '아메리카너구리', '아메리카들소', '아메리카불곰', '아이벡스', '아프리카물소', '안경곰', '안경원숭이', '알파카', '알락꼬리여우원숭이', '알래스카불곰', '양', '양털원숭이', '에스키모개', '여우', '여우청서', '여우원숭이', '염소', '영양', '오랑우탄', '오소리', '왕치타', '올빼미원숭이', '왈라비', '원숭이', '유대하늘다람쥐', '유럽들소', '인도들소', '인도별사슴', '인도영양', '일본원숭이', '일본산양', '작은쥐여우원숭이', '재규어', '재칼', '저빌', '점박이물범', '족제비', '주머니고양이', '주머니쥐', '줄무늬스컹크', '쥐', '쥐여우원숭이', '쥐캥거루', '진도개', '참고래', '참돌고래', '청설모', '치와와', '치타', '친칠라', '친칠라생쥐', '침팬지', '캘리포니아다람쥐', '캥거루', '코끼리', '코뿔소', '코알라', '코요테', '코주부원숭이', '콜로부스원숭이', '콜리 ', '콧수염게논', '콰가', '큰개미핥기', '큰고래', '큰뿔양', '타킨', '테리어', '토끼', '토끼박쥐', '톰슨가젤', '티베트산양', '파타스원숭이', '팬더마우스', '페르시아고양이', '펭귄', '표범', '푸들', '퓨마', '피그미고슴도치', '하늘다람쥐', '하마', '향고래', '한국늑대', '한국표범', '향유고래', '호랑이', '호저', '황금타킨', '혹등고래', '흰목꼬리감기원숭이', '흰목도리여우원숭이', '흰수염고래', '히말라야산양']
    let nickname = _.sample(names)
    let result_nickname = '익명의 ' + nickname
    return result_nickname
    // try {
    //   const result = await fs.readFile(path.join(__dirname, 'dictionary.txt'), 'utf8')
    //   var d = result.split('\n')
    //   var item = d[Math.floor(Math.random() * d.length)]
    //   nickname = '익명의 ' + item
    //   return nickname
    // } catch (e) {
    //   console.error(e)
    // }
  },
  claimJWTAccessToken: async (payload) => {
    // FIXME: CHANGE TOKEN EXPIRY IN PRODUCTION!!!!!!!
    let base_payload = {
      iss: 'team.Ojeongdong.Economics.Guardians',
      exp: Math.floor(Date.now() / 1000) + 360, // 360초(6분) 으로 설정
      ...payload,
    }

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
      let [result] = await pool.query('SELECT u.id, u.member_id, u.username, u.nickname, u.password, u.gender, u.email, u.created_at, u.type, u.user_image, oauth.provider, oauth.oauth_version, oauth.expired_at, oauth.is_activated FROM users u, oauth_id oauth WHERE u.member_id = oauth.member_id AND u.member_id = ? ORDER BY expired_at DESC LIMIT 1', [member_id])
      let payload = {
        member_id: result[0].member_id,
        nickname: result[0].nickname,
        username: result[0].username,
        email: result[0].email || null,
        type: result[0].type || 1,
        provider: result[0].provider || null,
        provider_version: result[0].provider_version || null
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
  getUserInfo: async (member_id) => {
    let [user] = await pool.query('SELECT u.id, u.member_id, u.username, u.nickname, u.password, u.gender, u.email, u.created_at, u.type, u.user_image, oauth.provider, oauth.oauth_version, oauth.expired_at, oauth.is_activated FROM users u, oauth_id oauth WHERE u.member_id = oauth.member_id AND u.member_id = ? ORDER BY expired_at DESC LIMIT 1', [member_id])
    return {
      'id': user[0].id,
      'member_id': user[0].member_id,
      'username': user[0].username,
      'nickname': user[0].nickname,
      'password': user[0].password,
      'gender': user[0].gender,
      'email': user[0].email,
      'created_at': user[0].created_at,
      'type': user[0].type,
      'user_image': user[0].user_image,
      'provider': user[0].provider,
      'oauth_version': user[0].oauth_version,
      'expired_at': user[0].expired_at,
      'is_activated': user[0].is_activated
    }
  }
}