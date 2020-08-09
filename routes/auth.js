const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const AuthHandler = require('./functions/Auth/handler')

router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), AuthHandler.loginByFacebook)

module.exports = router