const faker = require('faker/locale/ko')
const pool = require('../config/db')

module.exports = {
  readOrderByStar: async (data) => {
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
        ORDER BY `vote_grade_average` DESC', [data.member_id])
        
      console.log('평점순 점포 리스트 조회 완료: ', storeList)
      return storeList
    } catch (e) {
      console.log('평점 순 점포 리스트 조회 중 오류 발생' , e)
      throw new Error('평점 순 점포 리스트 조회 중 오류 발생')
    }
  },
  getReadOrderByStarDto: async (req) => {
    return {
      'member_id': req.user.member_id,
    }
  },
  createStoreInformation: async (data) => {
    try {
      let create = await pool.execute(
        'INSERT INTO `store_information` \
        (`store_indexholder`, `store_name`, `store_type`, `store_master`) \
        VALUES (?, ?, ?, ?)', [data.store_number, data.store_name, data.store_type, data.member_id]
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
    try {
      let register = await pool.execute(
        'INSERT INTO `starred_store` (`member_id`, `store_id`) \
        VALUES (?, ?)', [data.member_id, data.store_id]
      )

      let [response] = await pool.query(
        'SELECT * FROM `starred_store` \
        WHERE `member_id`= ? AND `store_id` = ? AND `is_visible` = 1',
        [data.member_id, data.store_id]
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
    try {
      let unRegister = await pool.execute(
        'UPDATE `starred_store` \
        SET `is_visible` = 0, `removed_at` = CURRENT_TIMESTAMP() \
        WHERE `member_id` = ? AND `store_id` = ? AND `is_visible` = 1', 
        [data.member_id, data.store_id]
      )

      let [response] = await pool.query(
        'SELECT * FROM `starred_store` \
        WHERE `member_id`= ? AND `store_id` = ? AND `is_visible` = 0 \
        ORDER BY `removed_at` DESC LIMIT 1',
        [data.member_id, data.store_id]
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
  CreateStoreOpeningTime: async (req, res, next) => {
    /**
      * URI: [POST, /api/store/time]
      */

    // Opening Times
    let storeId = 1
    let weekday = { 'sun': 1, 'mon': 2, 'tue': 3, 'wed': 4, 'thu': 5, 'fri': 6, 'sat': 7 }
    let start_hour = '9:00'
    let end_hour = '20:00'

    try {

      for (let i = 1; i <= 7; i++) {
        let query = await pool.query(
          'INSERT INTO `store_opening_hours` \
                    (`store_id`, `weekday`, `start_hour`, `end_hour`) \
                    VALUES (?, ?, TIME(?), TIME(?))', [storeId, i, start_hour, end_hour]
        )
      }

      let [response] = await pool.query(
        'SELECT `weekday`, `start_hour`, `end_hour` FROM `store_opening_hours` \
                WHERE `store_id`= ?', [storeId]
      )

      console.log('상점 영업 시간 생성 완료: ', response)
      res.status(201).json(response)
    } catch (e) {
      res.status(503).send(e)
      throw new Error('상점 영업 시간 생성 중 오류 발생')
    }
  },

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

  CreateStoreTelePhone: async (req, res, next) => {
    /**
      * URI: [POST, /api/store/telephone]
      */
    let storeId = 1

    try {

      for (let i = 1; i <= 7; i++) {
        let telephone = faker.phone.phoneNumber()

        let query = await pool.query(
          'INSERT INTO `store_telephone` \
                    (`store_id`, `telephone`) \
                    VALUES (?, ?)', [storeId, telephone]
        )
      }

      let [response] = await pool.query(
        'SELECT `telephone`, `is_verified` FROM `store_telephone` \
                WHERE `store_id`= ?', [storeId]
      )

      console.log('상품 등록 완료: ', response)
      res.status(201).json(response)
    } catch (e) {
      res.status(503).send(e)
      throw new Error('상품 등록 중 오류 발생')
    }
  },

  CreateVoteGrade: async (req, res, next) => {
    /**
      * URI: [POST, /api/store/:storeId/votegrade]
      * */
    let storeId = req.params.storeId
    let memberId = 18
    let grade1 = 4.5
    let grade2 = 4.5
    let grade3 = 4.5

    try {

      let query = await pool.execute(
        'INSERT INTO `store_vote_grade` \
                    (`store_id`, `member_id`, `question1`, `question2`, `question3`) \
                    VALUES (?, ?, ?, ?, ?)', [storeId, memberId, grade1, grade2, grade3]
      )

      let [response] = await pool.query(
        'SELECT * FROM `store_vote_grade` \
                WHERE `member_id`= ? AND `store_id` = ? AND `is_available` = 1', [memberId, storeId]
      )

      console.log('평점 등록 완료: ', response[0])
      res.status(201).json(response)[0]
    } catch (e) {
      res.status(503).send(e)
      throw new Error('평점 등록 중 오류 발생')
    }
  },
  UpdateVoteGrade: async (req, res, next) => {
    /**
      * URI: [PUT, /api/store/:storeId/votegrade]
      */

    let storeId = req.params.storeId
    let memberId = 18
    let grade1 = 4.5
    let grade2 = 4.5
    let grade3 = 4.5

    try {

      let removeVoteGrade = await pool.execute(
        'UPDATE `store_vote_grade` \
                SET `removed_at` = CURRENT_TIMESTAMP(), `is_available` = 0 \
                WHERE `member_id` = ? AND `store_id` = ? AND `is_available` = 1', [memberId, storeId]
      )

      let createVoteGrade = await pool.execute(
        'INSERT INTO `store_vote_grade` \
                (`store_id`, `member_id`, `question1`, `question2`, `question3`) \
                VALUES (?, ?, ?, ?, ?)', [storeId, memberId, grade1, grade2, grade3]
      )

      let [response] = await pool.query(
        'SELECT * FROM `store_vote_grade` \
                WHERE `member_id`= ? AND `store_id` = ? AND `is_available` = 1', [memberId, storeId]
      )

      console.log('평점 수정 완료: ', response[0])
      res.status(201).json(response)[0]
    } catch (e) {
      res.status(503).send(e)
      throw new Error('평점 수정 중 오류 발생')
    }
  },

  CreateOderType: async (req, res, next) => {
    /**
      * URI: [PUT, /api/ordertype?name=]
      */


    // let author = req.params.memberId
    let name = req.body
    let author = 18
    let sql = 'INSERT INTO `order_type` (`name`, `author`) VALUES '

    let valueList = []
    for (let row in name) {
      valueList.push('(\'' + name[row] + '\', ' + author + ')')
    }
    sql += valueList.join(', ')
    console.log(sql)
    try {

      let insertQuery = await pool.execute(sql)

      let [response] = await pool.query(
        'SELECT * FROM `order_type` \
                WHERE `ordertype_id`= last_insert_id()'
      )

      console.log('거래방식 생성 완료: ', response[0])
      res.status(201).json(response)[0]
    } catch (e) {
      res.status(503).send(e)
      throw new Error('거래방식 생성 중 오류 발생')
    }

  },
  MappingOrderTypeToStore: async (req, res, next) => {
    /**
                 * URI: [POST, /api/store/:storeId/ordertype]
                 */


    // let author = req.params.memberId
    let orderType = req.body
    let storeId = req.params.storeId
    let sql = 'INSERT INTO `store_to_ordertype` (`store_id`, `ordertype_id`) VALUES '

    let valueList = []
    for (let row in orderType) {
      valueList.push('(\'' + storeId + '\', (SELECT `ordertype_id` FROM `order_type` WHERE `name` = \'' + orderType[row] + '\'))')
    }
    sql += valueList.join(', ')
    console.log(sql)
    try {

      let insertQuery = await pool.execute(sql)

      // let [response] = await pool.query(
      //     "SELECT * FROM `order_type` \
      //     WHERE `ordertype_id`= last_insert_id()"
      // );

      console.log('거래방식 매핑 완료: ', response[0])
      res.status(201).json(response)[0]
    } catch (e) {
      res.status(503).send(e)
      throw new Error('거래방식 매핑 중 오류 발생')
    }
  },
}