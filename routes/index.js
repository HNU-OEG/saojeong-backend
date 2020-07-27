const express = require('express');

const router = express.Router();
const BoardHandler = require('./functions/Board/handler');
const UserHandler = require('./functions/User/handler');
const passport = require('../config/passport')

// router.get('/users', passport.authenticate('jwt', {session: false}), UserController.index);
// router.post('/auth/tokens', UserHandler.CreateJWTToken);

router.post('/admin/api/guest/customers.json', UserHandler.ClaimNewGuestUser);
router.put('/admin/api/edit/customers/:member_id.json', passport.authenticate('jwt', { session: false }), UserHandler.EditUserInfomation);
router.get("/hello", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.send("HELLO!!");
})


module.exports = router;
