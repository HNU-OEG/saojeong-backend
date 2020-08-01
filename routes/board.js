var express = require('express')
var router = express.Router()
const BoardHelper = require('../Helper/BoardHelper')
const BoardHandler = require('./functions/Board/handler')

// 게시판 관련
router.post('/', BoardHelper.CreateBoard)

// 게시글 관련
router.get('/:category/content', BoardHelper.GetAllBoardContentOrderByMethod)
router.get('/:category/content/:documentId', BoardHelper.GetBoardContent)
router.post('/:category/content', BoardHandler.WritePost)
router.put('/:category/content/:documentId', BoardHelper.UpdateBoardContent)
router.delete('/:category/content/:documentId', BoardHelper.DeleteBoardContent)
router.patch('/:category/content/:documentId', BoardHelper.PatchBoardContentVoteOrBlame)

module.exports = router