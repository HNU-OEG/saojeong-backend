const faker = require('faker')
const UserHelper = require('../../../Helper/UserHelper')
const pool = require('../../../config/db')
const jwt = require('jsonwebtoken')
const randToken = require('rand-token')

module.exports = {
  ClaimNewGuestUser: async (req, res, next) => {
    let nickname = await UserHelper.generateGuestNickname()
    let type = 1
    const gender = req.body.gender || ''
    const enabled = 1
    const ipaddr = req.header('x-forwarded-for') || req.connection.remoteAddress

    let data = {
      id: randToken.suid(20),
      username: '',
      nickname: nickname,
      type: type,
      gender: gender,
      enabled: enabled,
      ipaddr: ipaddr
    }

    try {
      const user = await pool.execute('insert into users (member_id, username, nickname, gender, type, enabled, last_updated_ip) values (?,?,?,?,?,?,?)', [data.id, data.username, data.nickname, data.gender, data.type, data.enabled, data.ipaddr])
      const [result] = await pool.query('select id, member_id, username, nickname, gender, created_at, type from users where id=last_insert_id()')
      let jwtpayload_data = {
        reference_id: result[0].id,
        member_id: result[0].member_id,
        nickname: result[0].nickname,
        usertype: result[0].type,
        username: '',
        usertype: 0,
        Provider: 'JWT'
      }
      const refreshToken = await UserHelper.claimJWTRefreshToken_firstuser(jwtpayload_data.member_id)
      const token = await UserHelper.claimJWTAccessToken(jwtpayload_data)
      console.log(token)
      return res.status(201).json({ result, 'AccessToken': token, 'RefreshToken': refreshToken })
    } catch (err) {
      console.log(err)
      res.status(400).json({ 'result': 'error' })
      throw new Error('사용자 생성 중 오류 발생', err)
    }
  },
  EditUserInfomation: async (req, res, next) => {
    let member_id = req.params.member_id // 파라미터의 사용자 id
    let auth_member_id = req.user.member_id // jwt의 사용자 id

    if (member_id !== auth_member_id) {
      return res.status(401).json({ 'result': 'error', 'message': '인증되지 않은 사용자입니다.' })
    } else {
      let nickname = req.body.nickname
      let userphoto = req.body.userphoto
      const ipaddr = req.header('x-forwarded-for') || req.connection.remoteAddress
      var data = {
        member_id: member_id,
        nickname: nickname,
        userphoto: userphoto,
        ip: ipaddr
      }

      try {
        let user = await pool.execute('update users set nickname = ?, last_updated_ip = ? WHERE member_id = ?', [data.nickname, data.ip, data.member_id])
        const [result] = await pool.query('select member_id, username, nickname, gender, created_at from users where member_id = ?', [data.member_id])
        const token = await UserHelper.claimAccessTokenByMemberId(member_id)
        return res.status(200).json({ result, token })
      } catch (err) {
        console.log(err)
        res.status(503).json({ 'result': 'error' })
        throw new Error('사용자 정보 변경에 실패하였습니다.', err)
      }

    }
  },
  // 폰은정....
  CreatePhoneUser: async (req, res, next) => {
    faker.locale = 'ko'
    for (let index = 0; index < 100; index++) {

      let name = faker.name.findName()
      let nickname = faker.commerce.productName()
      let gender = 1
      let email = faker.internet.email()
      let last_updated_ip = faker.internet.ip()
      let type = 1


      let data = {
        username: name,
        nickname: nickname,
        gender: 1,
        email: email,
        last_updated_ip: last_updated_ip,
        type: type
      }



      try {
        const user = await pool.execute('insert into users (username, nickname, gender, email, last_updated_ip, type) values (?,?,?,?,?,?) ', [data.username, data.nickname, data.gender, data.email, data.last_updated_ip, data.type])
      } catch (err) {
        throw new Error('사용자 생성 중 오류 발생', err, data)
      } finally {
        continue
      }


    }

    res.send(201)
  },
  CreatePhoneSession: async (req, res, next) => {
    faker.locale = 'ko'
    for (let index = 1; index < 300; index++) {
      let member_id = index
      let session_key = faker.random.number()
      let session_value = faker.random.uuid()
      let session_ip = faker.internet.ip()
      let last_updated = faker.date.future()


      let data = {
        member_id: member_id,
        session_key: session_key,
        session_value: session_value,
        session_ip: session_ip,
        last_updated: last_updated
      }

      if (await UserHelper.checkUserAvailablebyMemberID(data.member_id)) {
        try {
          const session = await pool.execute('insert into sessions (member_id, session_key, session_value, session_ip, last_updated) values (?,?,?,?,?)', [data.member_id, data.session_key, data.session_value, data.session_ip, data.last_updated])
          console.log(session)
        } catch (err) {
          console.log(err)
          throw new Error('사용자 생성 중 오류 발생', err, data)
        } finally {
          continue
        }
      }
    }

    res.send(201)
  },
  ClaimNewToken: async (req, res, next) => {
    let access_token = req.headers['authorization'].split(' ')[1]
    let member_id = jwt.decode(access_token).member_id
    let refresh_token = req.body.refreshToken

    try {
      let user_status = await UserHelper.checkUserStatus(member_id)
      if (!user_status == false) {
        let user = await UserHelper.checkUserAuthenticatedAvailability(member_id) // 사용자 사용 가능한지 확인
        if (!user == false) { //사용자가 사용가능하면
          let pl = jwt.verify(access_token, process.env.JWT_SECRET)
          var expirationDate = new Date(pl.exp)
          console.log('만료까지 ', Math.floor(expirationDate - (new Date() / 1000)), '초 남음.')

          if ((expirationDate - new Date()) > 60000) {
            return res.status(200).json({ 'accessToken': access_token })
          } else {
            let refreshPayload = {
              member_id: pl.member_id,
              nickname: pl.nickname,
              username: pl.username,
              usertype: pl.usertype,
              reference_id: pl.reference_id,
              Provider: pl.Provider,
            }
            let accessToken = await UserHelper.claimJWTAccessToken(refreshPayload)
            return res.status(201).json({ 'accessToken': accessToken })
          }
        } else {
          // 사용자가 정지되었을 때
          return res.status(401).json({ 'result': 'error', 'message': '이 RefreshToken은 사용할 수 없습니다. 로그인을 다시 시도해주세요.' })
        }
      } else {
        return res.status(404).json({ 'result': 'error', 'message': '탈퇴된 사용자입니다.' })
      }

    } catch (err) {
      if (err.name == 'TokenExpiredError') {
        let claim_accessToken = await UserHelper.claimAccessTokenByMemberId(member_id)
        let claim_refreshtoken = await UserHelper.claimJWTRefreshToken(member_id, refresh_token) //사용자 oauth refresh토큰 발급
        console.log(claim_accessToken, claim_refreshtoken)
        if (!claim_refreshtoken == 0) {
          return res.status(201).json({ 'member_id': member_id, 'accessToken': claim_accessToken, 'refreshToken': claim_refreshtoken })
        }
        // Refresh Token이 더이상 사용할 수 없을 때
        return res.status(401).json({ 'result': 'error', 'message': '이 Refresh Token은 사용할 수 없습니다. 로그인을 다시 시도해주세요.' })

      }
      console.log(err)
      return res.status(401).json({ 'result': 'error', 'message': '로그인을 다시 시도해주세요.' })
    }
  },
  RemoveGuestUser: async (req, res, next) => {
    if (!req.user.member_id == req.params.member_id) {
      return res.status(401).json({
        'errors': 'Error deleting customer, Users can remove Only allowed own account.'
      })

    } else {
      try {
        let revoke_oauth = await UserHelper.RevokeUserOAuthStatus(req.user.member_id)
        let change_status = await UserHelper.RemoveUser(req.user.member_id)

        return res.status(404).json({
          'status': 'Removed User.'
        })
      } catch (err) {
        return res.status(401).json({
          'errors': 'Error processing customer Sorry!'
        })
      }

    }
  }
}