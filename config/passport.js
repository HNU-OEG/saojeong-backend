const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const FacebookStrategy = require('passport-facebook').Strategy
const KakaoStrategy = require('passport-kakao-token').Strategy
const GoogleTokenStrategy = require('passport-google-id-token')
const FacebookTokenStrategy = require('passport-facebook-token')

const randToken = require('rand-token')
const UserHelper = require('../Helper/UserHelper')

let pool = require('./db')
const { claimNewSocialLoginJWTToken } = require('../Helper/UserHelper')
require('dotenv').config()

//JWT Strategy
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'team.Ojeongdong.Economics.Guardians'
}, async function (jwtPayload, done) {
  console.log('jwt payload ==> ', jwtPayload)

  try {
    let [result] = await pool.query('select member_id, type from users where member_id = ?', [jwtPayload.member_id])
    if (result[0].member_id == jwtPayload.member_id) {
      var PayLoad = {
        member_id: result[0].member_id,
        usertype: result[0].type,
      }
      return done(null, PayLoad)
    } else {
      console.log('페이로드가 안맞습니다. 인증 상태가 다른 상태에서 인증받으려 하고 있읍니다.')
      return done(null, false)
    }
  } catch (err) {
    console.log(err)
    return done(null, false)
  }
}
))

// Facebook Strategy
passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  fbGraphVersion: 'v7.0'
}, async function (accessToken, refreshToken, profile, done) {
  var userdata = {
    member_id: randToken.suid(20),
    username: profile.id,
    email: profile.emails[0].value,
    nickname: profile.displayName,
    type: 1,
    provider: 'Facebook',
    provider_version: '7.0',
    accessToken: accessToken || null,
    refreshToken: refreshToken || null
  }

  let [result] = await pool.query('SELECT u.member_id, u.username, u.email, u.nickname, u.type, o.provider, o.oauth_version, o.access_token, o.refresh_token, o.expired_at, o.is_activated FROM users AS u, oauth_id AS o WHERE u.member_id = o.member_id AND o.is_activated=1 AND u.enabled=1 AND o.provider != "JWT" AND u.username = ?', profile.id)


  // 사용자 정보가 없을때
  if (result.length == 0) {
    let user = await UserHelper.claimNewSocialLoginJWTToken(userdata.username, userdata.nickname, userdata.email, userdata.gender, userdata.ipaddr, userdata.provider, userdata.provider_version, userdata.accessToken, userdata.refreshToken, 1)
    return done(null, user)
  } else {
    // 사용자 정보가 존재할 때
    let jwtpayload_data = {
      reference_id: result[0].id,
      Provider: result[0].provider,
      member_id: result[0].member_id,
      username: result[0].username,
      nickname: result[0].nickname,
      usertype: result[0].type
    }
    const refreshToken = await UserHelper.claimJWTRefreshTokenForcefully(jwtpayload_data.member_id)
    const token = await UserHelper.claimJWTAccessToken(jwtpayload_data)
    return done(null, { result, 'AccessToken': token, 'RefreshToken': refreshToken })
  }
}))



// Kakao Strategy
passport.use(new KakaoStrategy({
  clientID: '5d4b3b19341f825def8c0b5888858420',
  clientSecret: 'ALc0wNfYeBAXBhnnac1GPc3fmyEaJMa7',
  callbackURL: 'http://localhost:3000/auth/kakao/token'
}, async function (accessToken, refreshToken, profile, done) {

  console.log('profile :>> ', profile)

  var userdata = {
    member_id: randToken.suid(20),
    username: profile.id,
    email: profile._json.kakao_account.email || null,
    nickname: profile.displayName,
    gender: profile._json.kakao_account.gender || null,
    type: 1,
    provider: 'Kakao',
    provider_version: 'v1',
    accessToken: accessToken || null,
    refreshToken: refreshToken || null
  }

  let [result] = await pool.query('SELECT u.member_id, u.username, u.email, u.nickname, u.type, o.provider, o.oauth_version, o.access_token, o.refresh_token, o.expired_at, o.is_activated FROM users AS u, oauth_id AS o WHERE u.member_id = o.member_id AND o.is_activated=1 AND u.enabled=1 AND o.provider != "JWT" AND u.username = ?', profile.id)


  // 사용자 정보가 없을때
  if (result.length == 0) {
    let user = await UserHelper.claimNewSocialLoginJWTToken(userdata.username, userdata.nickname, userdata.email, userdata.gender, userdata.ipaddr, userdata.provider, userdata.provider_version, userdata.accessToken, userdata.refreshToken, 1)
    return done(null, user)
  } else {
    // 사용자 정보가 존재할 때
    let jwtpayload_data = {
      reference_id: result[0].id,
      Provider: result[0].provider,
      member_id: result[0].member_id,
      username: result[0].username,
      nickname: result[0].nickname,
      usertype: result[0].type
    }
    const refreshToken = await UserHelper.claimJWTRefreshTokenForcefully(jwtpayload_data.member_id)
    const token = await UserHelper.claimJWTAccessToken(jwtpayload_data)
    return done(null, { result, 'AccessToken': token, 'RefreshToken': refreshToken })
  }
}))

passport.use(new GoogleTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
}, function (parsedToken, googleId, done) {
  console.log('accessToken :>> ', parsedToken)
  console.log('refreshToken :>>', googleId)
  // console.log('profile :>> ', profile)

}))


passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})


module.exports = passport          