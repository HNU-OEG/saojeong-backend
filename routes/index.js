const express = require('express')

const router = express.Router()
const BoardHandler = require('./functions/Board/handler')
const UserHandler = require('./functions/User/handler')
const passport = require('../config/passport')
const BoardHelper = require('../Helper/BoardHelper')
const StoreHelper = require('../Helper/StoreHelper')
const { kamisSync } = require('./functions/kamis-sync/handler')

// router.get('/users', passport.authenticate('jwt', {session: false}), UserController.index);
// router.post('/auth/tokens', UserHandler.CreateJWTToken);

// 새로운 사용자 생성
router.post('/admin/api/guest/customers.json', UserHandler.ClaimNewGuestUser)

// 생성된 사용자의 닉네임 등의 데이터 변경
router.put('/admin/api/edit/customers/:member_id.json', passport.authenticate('jwt', { session: false }), UserHandler.EditUserInfomation)

// 사용자 인증 처리
router.put('/auth/login', UserHandler.ClaimNewToken)

// 익명 사용자 로그아웃(탈퇴) 처리
router.delete('/admin/api/remove/guest/:member_id.json', passport.authenticate('jwt', { session: false }), UserHandler.RemoveGuestUser)

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

// 게시물 댓글 관련
router.put('/api/board/:category/content/:documentId/comment/:pastCommentId?/new', passport.authenticate('jwt', { session: false }), BoardHandler.PostNewComment)
router.patch('/api/board/:category/content/:documentId/comment/:commentId', passport.authenticate('jwt', { session: false }), BoardHandler.EditComment)
router.delete('/api/board/:category/content/:documentId/comment/:commentId', passport.authenticate('jwt', { session: false }), BoardHandler.RemoveComment)

// kamis 데이터 동기화
router.get('/cron/kamis-daily-sync', kamisSync)

module.exports = router