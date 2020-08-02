const express = require('express')
const router = express.Router()

const BoardHandler = require('./functions/Board/handler')
const UserHandler = require('./functions/User/handler')
const passport = require('../config/passport')
const BoardHelper = require('../Helper/BoardHelper')

// 사용자 인증 처리
router.put('/auth/login', UserHandler.ClaimNewToken)

router.get('/hello', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  console.log(req.passport.member_id)
  res.send('HELLO!!')
})

router.get('/generate-user', UserHandler.CreatePhoneUser)
router.get('/generate-session', UserHandler.CreatePhoneSession)

// 게시판 관련
router.post('/api/board', BoardHelper.CreateBoard)

// 게시물 검색
router.get('/search', BoardHandler.SearchBoard)


module.exports = router