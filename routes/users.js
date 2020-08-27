var express = require('express')
var router = express.Router()
let upload = require('../config/s3')

const UserHandler = require('./functions/User/handler')
const passport = require('../config/passport')

// 새로운 사용자 생성
router.post('/guest/customers.json', UserHandler.ClaimNewGuestUser)
// 생성된 사용자의 닉네임 등의 데이터 변경
router.put('/edit/customers/:member_id.json', passport.authenticate('jwt', { session: false }), UserHandler.EditUserInfomation)
// 익명 사용자 로그아웃(탈퇴) 처리
router.delete('/remove/guest/:member_id.json', passport.authenticate('jwt', { session: false }), UserHandler.RemoveGuestUser)
// 사용자 프로필 이미지 변경
router.put('/edit/customers/image', upload('profile').single('image'), passport.authenticate('jwt', { session: false }), UserHandler.EditUserImage)


module.exports = router
