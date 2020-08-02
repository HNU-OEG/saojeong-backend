const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const LocalStrategy = require('passport-local').Strategy
let pool = require('./db')
require('dotenv').config()

// Local Strategy
// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
// },
//     function (email, password, done) {
//         // 이 부분에선 저장되어 있는 User를 비교하면 된다. 
//         return UserModel.findOne({ where: { email: email, password: password } })
//             .then(user => {
//                 if (!user) {
//                     return done(null, false, { message: 'Incorrect email or password.' });
//                 }
//                 return done(null, user, { message: 'Logged In Successfully' });
//             })
//             .catch(err => done(err));
//     }
// ));

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


// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });


module.exports = passport