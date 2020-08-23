module.exports = {
  loginByFacebook: (req, res) => {
    res.json(req.user)
  },
  failedLogin: (req, res) => {
    return res.status(401).json({ 'result': 'failed', 'user': req.user })
  }
}