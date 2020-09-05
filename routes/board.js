var express = require('express')
var router = express.Router()
const BoardHelper = require('../Helper/BoardHelper')
const BoardHandler = require('./functions/Board/handler')

let upload = require('../config/s3')

// 게시판 관련
router.post('/', BoardHelper.CreateBoard)

// 게시글 관련
router.get('/:category/content/my', BoardHandler.ReadMyContent)
router.get('/:category/content/user', BoardHandler.ReadMyFreeContent)
router.get('/:category/content', BoardHandler.ReadAllBoardContents)
router.get('/:category/content/:documentId', BoardHandler.ReadBoardContent)
router.post('/:category/content', BoardHandler.PostNewBoardContent)
router.post('/news', upload('news').single('image'), BoardHandler.PostNewSaojeongNews)
router.put('/:category/content/:documentId', BoardHandler.EditBoardContent)
router.delete('/:category/content/:documentId', BoardHandler.RemoveBoardContent)
router.patch('/:category/content/:documentId', BoardHandler.VoteBoardContent)

// 게시물 댓글 관련
router.put('/:category/content/:documentId/comment/:pastCommentId?/new', BoardHandler.PostNewComment)
router.patch('/:category/content/:documentId/comment/:commentId', BoardHandler.EditComment)
router.delete('/:category/content/:documentId/comment/:commentId', BoardHandler.RemoveComment)

module.exports = router