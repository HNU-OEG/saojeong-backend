module.exports = {
  loginByFacebook: (req, res) => {
    // return res.redirect('/')
    return res.json({ 'userid': req.user })
  },
  failedLogin: (req, res) => {
    return res.status(401).json({ 'result': 'failed', 'user': req.user })
  }
}