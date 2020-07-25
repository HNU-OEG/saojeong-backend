const express = require('express');

const router = express.Router();
const BoardHandler = require('./functions/Board/handler');
const UserHandler = require('./functions/User/handler');

router.post('/admin/api/customers.json', UserHandler.CreateNewGuestUser);

module.exports = router;
