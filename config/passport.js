const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const FacebookStrategy = require('passport-facebook').Strategy
const randToken = require('rand-token')
const UserHelper = require('../Helper/UserHelper')

let pool = require('./db')
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


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name', 'displayName']
}, async function (accessToken, refreshToken, profile, cb) {
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

  let [result] = await pool.query('select member_id, username, email, nickname, type from users where username = ?', profile.id)

  // 사용자 정보가 없을때
  if (result.length == 0) {
    let user = await UserHelper.saveNewUserByOAuth(userdata.member_id, userdata.username, userdata.email, userdata.nickname, userdata.type)
    let oauth = await UserHelper.saveNewOAuthInfo(userdata.member_id, userdata.provider, userdata.provider_version, userdata.accessToken, userdata.refreshToken)
    return cb(null, userdata)
  } else {
    // 사용자 정보가 존재할 때
    userdata = {
      member_id: result[0].member_id,
      username: result[0].username,
      email: result[0].email,
      nickname: result[0].nickname,
      type: result[0].type,
      provider: 'Facebook',
      provider_version: '7.0',
    }
    return cb(null, userdata)
  }
}
))


passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})


module.exports = passport