const express = require('express');

const router = express.Router();
const BoardHandler = require('./functions/Board/handler');
const UserHandler = require('./functions/User/handler');
const BoardHelper = require('../Helper/BoardHelper');


router.post('/admin/api/customers.json', UserHandler.CreateNewGuestUser);


router.get('/generate-user', UserHandler.CreatePhoneUser);
router.get('/generate-session', UserHandler.CreatePhoneSession);
router.get('/test-ref', UserHandler.CheckRelation);


// 게시판 관련
router.post('/api/board', BoardHelper.CreateBoard);

// 게시글 관련
router.get('/api/board/:category/content', BoardHelper.ReadAllBoardContent);
router.get('/api/board/:category/content/:documentId', BoardHelper.ReadBoardContent);
router.post('/api/board/:category/content', BoardHelper.CreateBoardContent);
router.put('/api/board/:category/content/:documentId', BoardHelper.UpdateBoardContent);
router.delete('/api/board/:category/content/:documentId', BoardHelper.DeleteBoardContent);


module.exports = router;
