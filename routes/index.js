const express = require('express');

const router = express.Router();
const BoardHandler = require('./functions/Board/handler');
const UserHandler = require('./functions/User/handler');
// const db = require('../config/dbconfig.')
router.post('/admin/api/customers.json', UserHandler.CreateNewGuestUser);

router.get('/', (req, res, next) => {
    throw new Error("성찬이 에러");
})
module.exports = router;
