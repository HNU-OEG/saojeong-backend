var express = require('express')
var router = express.Router()
const BoardHelper = require('../Helper/BoardHelper')

// 게시판 관련
router.post('/api/board', BoardHelper.CreateBoard)

// 게시글 관련
router.get('/api/board/:category/content', BoardHelper.GetAllBoardContentOrderByMethod)
router.get('/api/board/:category/content/:documentId', BoardHelper.GetBoardContent)
router.post('/api/board/:category/content', BoardHelper.CreateBoardContent)
router.put('/api/board/:category/content/:documentId', BoardHelper.UpdateBoardContent)
router.delete('/api/board/:category/content/:documentId', BoardHelper.DeleteBoardContent)
router.patch('/api/board/:category/content/:documentId', BoardHelper.PatchBoardContentVoteOrBlame)

module.exports = router