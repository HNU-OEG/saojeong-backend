var express = require('express')
var router = express.Router()

let upload = require('../config/s3')
const S3Hanlder = require('./functions/S3/handler')
const passport = require('../config/passport')



// router.post('/upload', upload.single('image'), S3Hanlder.UploadImage)
// router.post('/uploads', upload.array('images', 3), S3Hanlder.UploadImages)


module.exports = router