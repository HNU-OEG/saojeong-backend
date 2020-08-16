let aws = require('aws-sdk')
let multer = require('multer')
let multerS3 = require('multer-s3')

let s3 = new aws.S3({
  secretAccessKey: process.env.AWS_ACCESS_KEYENV_VAR,
  accesKeyId: process.env.AWS_SECRET_KEYENV_VAR,
})

var upload = (path) => {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: 'saojeong-images/' + path,
      acl: 'public-read',
      key: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname.split('.').pop())
      }
    })
  })
}

module.exports = upload