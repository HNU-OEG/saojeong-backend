const express = require('express');

const router = express.Router();
const BoardHandler = require('./functions/Board/handler');
const UserHandler = require('./functions/User/handler');


router.post('/admin/api/customers.json', UserHandler.CreateNewGuestUser);


router.get('/generate-user', UserHandler.CreatePhoneUser);
router.get('/generate-session', UserHandler.CreatePhoneSession);
router.get('/test-ref', UserHandler.CheckRelation);

module.exports = router;
