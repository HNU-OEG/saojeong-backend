

module.exports = {
  UploadImage: async (req, res, next) => {
    console.log(req.file)
    const image = req.file.location
    if (image === undefined) {
      return res.status(400).send('실패')
    }
    res.status(200).send(req.file)
  },
  UploadImages: async (req, res, next) => {
    res.send('Successfully uploaded ' + req.files.length + ' files!')
  }
}