const express = require('express');

const router = express.Router();
const BoardHandler = require('./functions/Board/handler');
const UserHandler = require('./functions/User/handler');


router.post('/admin/api/guest/customers.json', UserHandler.ClaimNewGuestUser);

module.exports = router;
