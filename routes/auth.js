const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const AuthHandler = require('./functions/Auth/handler')

router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }))
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/failedLogin' }), AuthHandler.loginByFacebook)
router.get('/failedLogin', AuthHandler.failedLogin)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/auth/failedLogin')
})
module.exports = router