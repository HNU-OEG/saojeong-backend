const express = require('express');

const router = express.Router();
const BoardHandler = require('./functions/Board/handler');
const UserHandler = require('./functions/User/handler');

const BoardHelper = require('../Helper/BoardHelper');
const passport = require('../config/passport')

// router.get('/users', passport.authenticate('jwt', {session: false}), UserController.index);
// router.post('/auth/tokens', UserHandler.CreateJWTToken);

router.post('/admin/api/guest/customers.json', UserHandler.ClaimNewGuestUser);
router.put('/admin/api/edit/customers/:member_id.json', passport.authenticate('jwt', { session: false }), UserHandler.EditUserInfomation);
router.get("/hello", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.send("HELLO!!");
})


router.get('/generate-user', UserHandler.CreatePhoneUser);
router.get('/generate-session', UserHandler.CreatePhoneSession);
router.get('/test-ref', UserHandler.CheckRelation);


// 게시판 관련
router.post('/api/board', BoardHelper.CreateBoard);

// 게시글 관련
router.get('/api/board/:category/content', BoardHelper.GetAllBoardContentOrderByMethod);
router.get('/api/board/:category/content/:documentId', BoardHelper.GetBoardContent);
router.post('/api/board/:category/content', BoardHelper.CreateBoardContent);
router.put('/api/board/:category/content/:documentId', BoardHelper.UpdateBoardContent);
router.delete('/api/board/:category/content/:documentId', BoardHelper.DeleteBoardContent);
router.patch('/api/board/:category/content/:documentId', BoardHelper.PatchBoardContentVoteOrBlame);

module.exports = router;
