const pool = require('../config/db')

module.exports = {
  postSeasonalFood: async (data) => {
    let type = data.type
    let month = data.month
    let name = data.name
    let image = data.image
    try {
      let postSeasonalFood = await pool.execute(
        'INSERT INTO `seasonal_food` (`month`, `name`, `type`, `image`) \
        VALUES (?, ?, ?, ?)', [month, name, type, image]
      )

      let [response] = await pool.query(
        'SELECT * FROM `seasonal_food` WHERE `id` = last_insert_id()'
      )

      console.log('제철음식 생성 완료: ', response[0])
      return response[0]
    } catch (e) {
      console.log('제철음식 생성 중 오류 발생', e)
      throw new Error('제철음식 생성 중 오류 발생\n', e)
    }
  },
  getPostSeasonalFoodDto: async (req) => {
    return {
      'type': req.params.type,
      'month': req.params.month,
      'name': req.body.name,
      'image': req.file.location,
    }
  },
  readSeasonalFood: async (req) => {
    let type = req.params.type
    let month = req.params.month

    try {
      let [response] = await pool.query(
        'SELECT * FROM `seasonal_food` WHERE `type` = ? AND `month` = ?', 
        [type, month]
      )

      console.log('제철음식 조회 완료: ', response)
      return response
    } catch (e) {
      console.log('제철음식 조회 중 오류 발생', e)
      throw new Error('제철음식 조회 중 오류 발생\n', e)
    }
  }
}