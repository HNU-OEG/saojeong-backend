const SeasonalHelper = require('../../../Helper/SeasonalHelper')
const S3Helper = require('../../../Helper/S3Helper')

module.exports = {
  PostSeasonalFood: async (req, res, next) => {
    /**
     * URI: [POST, /api/foods/type/:type/month/:month]
     * Request Body(form-data): {
     * 'food': '가지', 
     * 'image': 이미지 파일
     * }
     */
    if (!S3Helper.checkUploaded(req.file.location)) {
      res.status(503).send('제철음식 업로드 실패!')   
    }

    let data = await SeasonalHelper.getPostSeasonalFoodDto(req)
    let seasonalFood = SeasonalHelper.postSeasonalFoood(data)
    seasonalFood
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
}