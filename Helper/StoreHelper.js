const faker = require('faker/locale/ko')
const pool = require('../config/db')

module.exports = {
  readAllOrderByGrade: async (data) => {
    let member_id  = data.member_id
    try {
      let storeList = pool.query(
        'SELECT \
          `store_indexholder` AS `store_number`, \
          `store_name`, `vote_grade_average`, \
          `vote_grade_count`, `store_id`, \
          IF\
          ((SELECT `created_at` FROM `starred_store` AS ss \
          WHERE `member_id` = ? AND `ss`.`store_id` = `si`.`store_id` AND `is_visible` = 1 LIMIT 1) \
          IS NOT NULL, TRUE, FALSE) AS `starred` \
        FROM `store_information` AS `si` \
        WHERE `is_visible` = 1 \
        ORDER BY `vote_grade_average` DESC', [member_id])

      console.log('평점순 점포 리스트 조회 완료: ', storeList)
      return storeList
    } catch (e) {
      console.log('평점 순 점포 리스트 조회 중 오류 발생' , e)
      throw new Error('평점 순 점포 리스트 조회 중 오류 발생')
    }
  },
  getAllReadOrderByGradeDto: async (req) => {
    return {
      'member_id': req.user.member_id,
    }
  },
  getSqlForReadOrderByType: async (data) => {
    let orderby = data.orderby
    let sql = 
    'SELECT \
      `store_indexholder` AS `store_number`, \
      `store_name`, `vote_grade_average`, \
      `vote_grade_count`, `store_id`, `store_intro`, \
      IF((SELECT `created_at` FROM `starred_store` AS ss \
      WHERE `member_id` = ? AND `ss`.`store_id` = `si`.`store_id` AND `is_visible` = 1 LIMIT 1) \
      IS NOT NULL, TRUE, FALSE) AS `starred` \
    FROM `store_information` AS `si` \
    WHERE `is_visible` = 1 AND `store_type` = ? \
    ORDER BY ?'

    if (orderby === 'vote_grade_average') {
      sql += ' DESC'
    } else if (orderby === 'store_name') {
      sql += ' ASC'
    }

    data.sql = sql
    return data
  },
  readOrderByType: async (data) => {
    let member_id = data.member_id
    let orderby = data.orderby
    let type = data.type
    let sql = data.sql

    try {
      let storeList = pool.query(sql, [member_id, type, orderby])

      console.log('평점순 점포 리스트 조회 완료: ', storeList)
      return storeList
    } catch (e) {
      console.log('평점 순 점포 리스트 조회 중 오류 발생' , e)
      throw new Error('평점 순 점포 리스트 조회 중 오류 발생')
    }
  },
  getReadOrderByTypeDto: async (req) => {
    let type = {'fruits': '과일', 'vegetables': '채소', 'seafoods': '수산',}
    let orderby = {'grade': 'vote_grade_average', 'name': 'store_name',}
    return {
      'member_id': req.user.member_id,
      'type': type[req.params.type],
      'orderby': orderby[req.params.orderby]
    }
  },
  createStoreInformation: async (data) => {
    let member_id = data.member_id
    let store_number = data.store_number
    let store_name = data.store_name
    let store_type = data.store_type

    try {
      let create = await pool.execute(
        'INSERT INTO `store_information` \
        (`store_indexholder`, `store_name`, `store_type`, `store_master`) \
        VALUES (?, ?, ?, ?)', [store_number, store_name, store_type, member_id]
      )

      let [response] = await pool.query(
        'SELECT * FROM `store_information` \
        WHERE `store_id`= last_insert_id()'
      )

      console.log('상점 생성 완료: ', response[0])
      return response[0]
    } catch (e) {
      console.log('상점 생성 중 오류 발생\n', e)
      throw new Error('상점 생성 중 오류 발생')
    }
  },
  getCreateStoreInformaitionDto: async (req) => {
    return {
      'member_id': req.user.member_id,
      'store_type': req.body.store_type,
      'store_name': req.body.store_name,
      'store_number': req.body.store_number,
    }
  },
  registerStarredStore: async (data) => {
    let member_id = data.member_id
    let store_id = data.store_id
    try {
      let register = await pool.execute(
        'INSERT INTO `starred_store` (`member_id`, `store_id`) \
        VALUES (?, ?)', [member_id, store_id]
      )

      let [response] = await pool.query(
        'SELECT * FROM `starred_store` \
        WHERE `member_id`= ? AND `store_id` = ? AND `is_visible` = 1',
        [member_id, store_id]
      )

      console.log('점포 좋아요 완료: ', response[0])
      return response[0]
    } catch (e) {
      console.log('점포 좋아요 중 오류 발생\n', e)
      throw new Error('점포 좋아요 중 오류 발생', e)
    }
  },
  getRegisterStarredStoreDto: async (req) => {
    return {
      'member_id': req.user.member_id,
      'store_id': req.params.storeId,
    }
  },
  unRegisterStarredStore: async (data) => {
    let member_id = data.member_id
    let store_id = data.store_id

    try {
      let unRegister = await pool.execute(
        'UPDATE `starred_store` \
        SET `is_visible` = 0, `removed_at` = CURRENT_TIMESTAMP() \
        WHERE `member_id` = ? AND `store_id` = ? AND `is_visible` = 1', 
        [member_id, store_id]
      )

      let [response] = await pool.query(
        'SELECT * FROM `starred_store` \
        WHERE `member_id`= ? AND `store_id` = ? AND `is_visible` = 0 \
        ORDER BY `removed_at` DESC LIMIT 1',
        [member_id, store_id]
      )

      console.log('점포 좋아요 취소 완료: ', response[0])
      return response[0]
    } catch (e) {
      console.log('점포 좋아요 취소 중 오류 발생\n', e)
      throw new Error('점포 좋아요 취소 중 오류 발생', e)
    }
  },
  getUnRegisterStarredStoreDto: async (req) => {
    return {
      'member_id': req.user.member_id,
      'store_id': req.params.storeId,
    }
  },
  createOpeningTime: async (data) => {
    let sql = data.sql
    let store_id = data.store_id
    try {
      let create = await pool.execute(sql)
      
      let [response] = await pool.query(
        'SELECT `weekday`, TIME_FORMAT(`start_hour`, "%H:%i") AS `open`, TIME_FORMAT(`end_hour`, "%H:%i") AS `close` FROM `store_opening_hours` \
        WHERE `store_id`= ? ORDER BY `weekday` ASC', 
        [store_id]
      )

      console.log('상점 영업 시간 생성 완료: ', response)
      return response
    } catch (e) {
      console.log('상점 영업 시간 생성 중 오류 발생', e)
      throw new Error('상점 영업 시간 생성 중 오류 발생', e)
    }
  },
  getCreateOpeningTimeDto: async (req) => {
    return {
      'store_id': req.params.storeId,
      'body': req.body
    }
  },
  getSqlForCreateOpeningTIme: async (data) => {
    let body = data.body
    let store_id = data.store_id

    let weekday = { 'sun': 1, 'mon': 2, 'tue': 3, 'wed': 4, 'thu': 5, 'fri': 6, 'sat': 7 }
    let sql = 'INSERT INTO `store_opening_hours` \
              (`store_id`, `weekday`, `start_hour`, `end_hour`) VALUES '

    let valueList = []
    for (let row in body) {
      let day = body[row]
      valueList.push('(' + store_id + ', ' + weekday[row] + ', TIME("' + day.open + '"), TIME("' + day.close + '"))')
    }
    sql += valueList.join(', ')

    data.sql = sql
    return data
  },
  createTelephone: async (data) => {
    let sql = data.sql
    let store_id = data.store_id

    try {
      let create = await pool.execute(sql)
      let [response] = await pool.query(
        'SELECT * FROM `store_telephone` \
        WHERE `store_id`= ? AND `is_visible` = 1', [store_id]
      )

      console.log('번호 등록  완료: ', response)
      return response
    } catch (e) {
      console.log('번호 등록 중 오류 발생', e)
      throw new Error('번호 등록 중 오류 발생')
    }
  },
  getCreateTelephoneDto: async (req) => {   
    return {
      'store_id' : req.params.storeId,
      'body': req.body,
    }
  },
  getSqlForCreateTelephone: async (data) => {
    let sql = 'INSERT INTO `store_telephone` \
              (`store_id`, `telephone`) VALUES '

    let valueList = []
    for (let row in data.body) {
      let telephone = data.body[row]
      valueList.push('(' + data.store_id + ', "' + telephone + '")')
    }
    sql += valueList.join(', ')
    data.sql = sql
    return data
  },
  createVoteGrade: async (data) => {
    let store_id = data.store_id
    let member_id = data.member_id
    let q1 = data.kindness
    let q2 = data.merchandise
    let q3 = data.price

    try {
      let query = await pool.execute(
        'INSERT INTO `store_vote_grade` \
        (`store_id`, `member_id`, `question1`, `question2`, `question3`) \
        VALUES (?, ?, ?, ?, ?)', [store_id, member_id, q1, q2, q3]
      )

      let [response] = await pool.query(
        'SELECT * FROM `store_vote_grade` \
        WHERE `member_id`= ? AND `store_id` = ? AND `is_available` = 1', 
        [member_id, store_id]
      )

      console.log('평점 등록 완료: ', response[0])
      return response[0]
    } catch (e) {
      console.log('평점 등록 중 오류 발생', e)
      throw new Error('평점 등록 중 오류 발생')
    }
  },
  getVoteGradeDto: async (req) => {
    return {
      'member_id': req.user.member_id,
      'store_id': req.params.storeId,
      'kindness': req.body.kindness,
      'merchandise': req.body.merchandise,
      'price': req.body.price,
    }
  },
  editVoteGrade: async (data) => {
    /**
      * URI: [PUT, /api/store/:storeId/votegrade]
      */
    let store_id = data.store_id
    let member_id = data.member_id
    let q1 = data.kindness
    let q2 = data.merchandise
    let q3 = data.price

    try {
      let removeVoteGrade = await pool.execute(
        'UPDATE `store_vote_grade` \
        SET `removed_at` = CURRENT_TIMESTAMP(), `is_available` = 0 \
        WHERE `member_id` = ? AND `store_id` = ? AND `is_available` = 1', 
        [member_id, store_id]
      )

      let editVoteGrade = await pool.execute(
        'INSERT INTO `store_vote_grade` \
        (`store_id`, `member_id`, `question1`, `question2`, `question3`) \
        VALUES (?, ?, ?, ?, ?)', [store_id, member_id, q1, q2, q3]
      )

      let [response] = await pool.query(
        'SELECT * FROM `store_vote_grade` \
        WHERE `member_id`= ? AND `store_id` = ? AND `is_available` = 1', 
        [member_id, store_id]
      )

      console.log('평점 수정 완료: ', response[0])
      return response[0]
    } catch (e) {
      console.log('평점 수정 중 오류 발생', e)
      throw new Error('평점 수정 중 오류 발생')
    }
  },
  createOrderType: async (data) => {
    console.log(data)
    try {
      let create = await pool.execute(data.sql)

      let [response] = await pool.query(
        'SELECT * FROM `order_type` WHERE `is_visible` = 1'
      )

      console.log('거래방식 생성 완료: ', response)
      return response
    } catch (e) {
      console.log('거래방식 생성 중 오류 발생', e)
      throw new Error('거래방식 생성 중 오류 발생')
    }
  },
  getCreateOrderTypeDto: async (req) => {
    return {
      'author': req.user.member_id,
      'body': req.body
    }
  },
  getSqlForCreateOrderType: async (data) => {
    let body = data.body
    let author = data.author
    
    let sql = 'INSERT INTO `order_type` (`name`, `author`) VALUES '
    
    let valueList = []
    for (let row in body) {
      valueList.push('(\'' + body[row] + '\', \'' + author + '\')')
    }
    
    sql += valueList.join(', ')
    data.sql = sql
    return data
  },
  registerOrderTypeOnStore: async (data) => {
    try {
      let insertQuery = await pool.execute(data.sql)

      let [response] = await pool.query(
        'SELECT * FROM `store_to_ordertype` \
        WHERE `store_id`= ?', [data.store_id]
      )

      console.log('거래방식 매핑 완료: ', response)
      return response
    } catch (e) {
      console.log('거래방식 매핑 중 오류 발생', e)
      throw new Error('거래방식 매핑 중 오류 발생')
    }
  },
  getRegisterOrderTypeDto: async (req) => {
    return {
      'store_id': req.params.storeId,
      'body': req.body
    }
  },
  getSqlForRegisterOrderType: async (data) => {
    let store_id = data.store_id
    let body = data.body
    
    let sql = 'INSERT INTO `store_to_ordertype` (`store_id`, `ordertype_id`) VALUES '
    
    let valueList = []
    for (let row in body) {
      let id = body[row].id
      valueList.push('(\'' + store_id + '\', ' + id + ')')
    }
    sql += valueList.join(', ')
    data.sql = sql
    return data
  },


  // 판매 품목 관련 로직이 정의 되어야합니다
  CreateStoreMerchandise: async (req, res, next) => {
    /**
      * URI: [POST, /api/store/merchandise]
      */


    let storeId = 1
    try {

      for (let i = 1; i <= 7; i++) {
        let name = faker.name.lastName()
        let price = faker.commerce.price()
        let lastUpdatedIp = faker.internet.ip()

        let query = await pool.query(
          'INSERT INTO `store_merchandise` \
                    (`store_id`, `name`, `price`, `last_updated_ip`) \
                    VALUES (?, ?, ?, ?)', [storeId, name, price, lastUpdatedIp]
        )
      }

      let [response] = await pool.query(
        'SELECT `name`, `price` FROM `store_merchandise` \
                WHERE `store_id`= ?', [storeId]
      )

      console.log('상품 등록 완료: ', response)
      res.status(201).json(response)
    } catch (e) {
      res.status(503).send(e)
      throw new Error('상품 등록 중 오류 발생')
    }

  },
}
