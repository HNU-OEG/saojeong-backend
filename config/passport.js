const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const FacebookStrategy = require('passport-facebook').Strategy
const randToken = require('rand-token')

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
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, async function (accessToken, refreshToken, profile, cb) {
  let userdata = {
    member_id: randToken.suid(20),
    username: profile.id,
    nickname: profile.displayName,
    type: 1,
    provider: 'Facebook',
    provider_version: '7.0'
  }
  console.log(accessToken, refreshToken)
  try {
    let [result] = await pool.query('select username from users where username = ?', profile.id)
    if (result.length == 0) {
      let save_userdata = await pool.execute('insert into users (member_id, username, nickname, type) values (?,?,?,?)', [userdata.member_id, userdata.username, userdata.nickname, userdata.type])
      let save_oauth_info = await pool.execute('insert into oauth_id (member_id, provider, oauth_version, access_token, refresh_token) values (?,?,?,?,?)', [userdata.member_id, userdata.provider, userdata.provider_version, accessToken, refreshToken])
      return cb(null, userdata)
    } else {
      return cb(null, userdata)
    }
  } catch (err) {
    return cb(err, null)
  }
  // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
  //   return cb(err, user)
  // })
}
))


passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})


module.exports = passport