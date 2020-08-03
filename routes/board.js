var express = require('express')
var router = express.Router()
const BoardHelper = require('../Helper/BoardHelper')
const BoardHandler = require('./functions/Board/handler')

// 게시판 관련
router.post('/', BoardHelper.CreateBoard)

// 게시글 관련
router.get('/:category/content', BoardHelper.GetAllBoardContentOrderByMethod)
router.get('/:category/content/:documentId', BoardHelper.GetBoardContent)

router.post('/:category/content', BoardHandler.PostNewBoardContent)
router.put('/:category/content/:documentId', BoardHandler.EditBoardContent)
router.delete('/:category/content/:documentId', BoardHandler.RemoveBoardContent)
router.patch('/:category/content/:documentId', BoardHandler.VoteBoardContent)

// 게시물 댓글 관련
router.put('/:category/content/:documentId/comment/:pastCommentId?/new', BoardHandler.PostNewComment)
router.patch('/:category/content/:documentId/comment/:commentId', BoardHandler.EditComment)
router.delete('/:category/content/:documentId/comment/:commentId', BoardHandler.RemoveComment)

module.exports = router