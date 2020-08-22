const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const AuthHandler = require('./functions/Auth/handler')

// Facebook
// router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }))
// router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/failedLogin' }), AuthHandler.loginByFacebook)
// router.get('/failedLogin', AuthHandler.failedLogin)

// Facebook
// router.get('/facebook-token', passport.authenticate('facebook-token', { scope: 'email' }))
router.get('/facebook/token', passport.authenticate('facebook-token', { failureRedirect: '/auth/failedLogin' }), AuthHandler.loginByFacebook)
router.get('/failedLogin', AuthHandler.failedLogin)


// Kakao
router.get('/kakao', passport.authenticate('kakao-token'))
router.get('/kakao/token', passport.authenticate('kakao-token', { failureRedirect: '/auth/failedLogin' }), AuthHandler.loginByFacebook)
router.get('/kakao/callback', passport.authenticate('kakao-token', { failureRedirect: '/auth/failedLogin' }), AuthHandler.loginByFacebook)

router.get('/failedLogin', AuthHandler.failedLogin)

// Google
router.get('/google', passport.authenticate('google-id-token'))
router.get('/google/token', passport.authenticate('google-id-token', { failureRedirect: '/auth/failedLogin' }), AuthHandler.loginByFacebook)
router.get('/failedLogin', AuthHandler.failedLogin)


router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/auth/failedLogin')
})
module.exports = router