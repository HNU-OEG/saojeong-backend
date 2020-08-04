const faker = require('faker/locale/ko')
const pool = require('../config/db')

module.exports = {
  readAllStore: async (req, res, next) => {
    // 평점평균
    // 하트 눌렀는지
    // 72번
    // 상점이름
    // 평가인원
    // 사진
    try {
      // let query = await pool.query(
      //   "SELECT s.store_indexholder AS store_number, s.store_name, s.store_image, s.vote_grade_average, s.vote_grade_count, s.store_id \
      //   FROM store_information AS s, users AS u, starred_store AS ss \
      //   WHERE s.is_visible = 1 AND u.enabled = 1, AND ss.is_isvisible = 1 \"
      // )

      let [response] = await pool.query(
        'SELECT * FROM `boards` \
                WHERE `board_id`= last_insert_id()'
      )

      console.log('점포 리스트 조회 완료: ', response[0])
      res.status(201).json(response[0])
    } catch (e) {
      res.status(503).send(e)
      throw new Error('점포 리스트 조회 중 오류 발생')
    }
  },
  createStoreInformation: async (data) => {
    /**
      * URI: [POST, /api/store]
      * Request Body: {
      *   "store_name": "...",
      *   "store_number": ...,
      *   "store_type": [과일, 채소, 수산],
      * }
      */
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

  CreateStarredStore: async (req, res, next) => {
    /**
     * URI: [POST, /api/store/:storeId/star]
     */

    
    let storeId = req.params.storeId
    // let memberId = req.user.member_id
    let memberId = 18

    try {

      let query = await pool.execute(
        'INSERT INTO `starred_store` (`member_id`, `store_id`) \
        VALUES (?, ?)', [memberId, storeId])

      

      let [response] = await pool.query(
        'SELECT * FROM `starred_store` \
        WHERE `member_id` = ? AND `store_id` = ? AND `is_visible` = 1', [memberId, storeId])

      console.log('좋아요 생성 완료: ', response[0])
      res.status(201).json(response[0])
    } catch (e) {
      res.status(503).send(e)
      throw new Error('좋아요 생성 중 오류 발생: ', e)
    }
  },

  DeleteStarredStore: async (req, res, next) => {
    /**
      * URI: [DELETE, /api/store/:storeId/star]
      */

    
    let storeId = req.params.storeId
    // let memberId = req.user.member_id
    let memberId = 18

    try {

      let removeStar = await pool.execute(
        'UPDATE `starred_store` \
        SET `removed_at` = CURRENT_TIMESTAMP(), `is_visible` = 0 \
        WHERE `member_id` = ? AND `store_id` = ? AND `is_visible` = 1',
        [memberId, storeId])

      let [response] = await pool.query(
        'SELECT * FROM `starred_store` \
        WHERE `member_id` = ? AND `store_id` = ? AND `is_visible` = 0 \
        ORDER BY `removed_at` DESC LIMIT 1', [memberId, storeId]
      )

      console.log('좋아요 취소 완료: ', response[0])
      res.status(201).json(response[0])
    } catch (e) {
      res.status(503).send(e)
      throw new Error('좋아요 취소 중 오류 발생: ', e)
    }
  },
}