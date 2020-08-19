const express = require('express')
const router = express.Router()

const BoardHandler = require('./functions/Board/handler')
const UserHandler = require('./functions/User/handler')
const passport = require('../config/passport')
const BoardHelper = require('../Helper/BoardHelper')
const StoreHelper = require('../Helper/StoreHelper')
const { kamisSync, eventSync } = require('./functions/kamis-sync/handler')
const { CreateCategory } = require('../database/models/category')
// router.get('/users', passport.authenticate('jwt', {session: false}), UserController.index);
// router.post('/auth/tokens', UserHandler.CreateJWTToken);

// 새로운 사용자 생성
router.post('/admin/api/guest/customers.json', UserHandler.ClaimNewGuestUser)

// 생성된 사용자의 닉네임 등의 데이터 변경
router.put('/admin/api/edit/customers/:member_id.json', passport.authenticate('jwt', { session: false }), UserHandler.EditUserInfomation)

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


// kamis 데이터 동기화
router.get('/cron/kamis-daily-sync', kamisSync)
router.get('/cron/process-event', eventSync)

// 설정
router.put('/settings/update-category', async (req, res, next) => {
  let update = await CreateCategory
  return update
})
module.exports = router