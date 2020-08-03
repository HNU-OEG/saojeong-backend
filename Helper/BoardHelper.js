const faker = require('faker/locale/ko')
const pool = require('../config/db')
const BoardHelper2 = require('./BoardHelper2')
const { title } = require('faker/lib/locales/ko')


module.exports = {
  // CheckUsername:
  CreateBoard: async (req, res, next) => {
    /**
         *  URI: [POST, /api/board]
         *  Request Body: {
         *    "name": "OO게시판"
         *  }
         */

    let name = req.body.name
    let ip = faker.internet.ip()
    // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // localhost에서는 동작 안함

    try {
      let query = await pool.execute(
        'INSERT INTO `boards` (`name`, `ip_addr`) \
                VALUES (?, ?) ', [name, ip]
      )

      let [response] = await pool.query(
        'SELECT * FROM `boards` \
                WHERE `board_id`= last_insert_id()'
      )

      console.log('게시판 생성 완료: ', response[0])
      res.status(201).json(response[0])
    } catch (e) {
      res.status(503).send(e)
      throw new Error('게시판 생성 중 오류 발생')
    }
  },

  GetBoardContent: async (req, res, next) => {
    /**
     * URI: [GET, /api/board/:category/content/:documentId]
     * Response Body: {
     *   "document_id": :documentId,
     *   "title": "TEST01",
     *   "content": "TEST0001",
     *   "created_at": "07.26 09:25",
     *   "category": "공지사항"
     *   "author": "Intelligent Metal Sausages"
     * }
     */

    let memberId = 18
    // let memberId = req.passport.user;
    let documentId = req.params.documentId

    try {
      let [content] = await pool.query(
        'SELECT c.document_id, c.title, c.content, DATE_FORMAT(c.created_at, \'%m.%d %H:%i\') AS created_at, b.name AS category, u.nickname AS author \
                FROM `board_contents` AS `c` \
                INNER JOIN `boards` AS `b` ON c.board_category = b.board_id \
                INNER JOIN `users` AS `u` ON c.member_id = u.member_id \
                WHERE c.document_id = ?', [documentId]
      )

      let [replies] = await pool.query('SELECT comm.comment_id, comm.member_id, comm.comment_author, comm.comment_created_at, comm.comment_content, comm.comment_parent FROM board_contents cont, board_comments comm WHERE cont.document_id = comm.document_id AND comm.is_visible = 1 ORDER BY comm.comment_created_at asc')

      var comments = []
      let comment = replies.map(reply => {
        if (reply.comment_parent == null) {
          comments[reply.comment_id] = {
            member_id: reply.member_id,
            author: reply.comment_author,
            content: reply.comment_content,
            created_at: reply.comment_created_at,
            replies: []
          }
        } else {
          comments[reply.comment_parent].replies = [
            {
              member_id: reply.member_id,
              author: reply.comment_author,
              content: reply.comment_content,
              created_at: reply.comment_created_at,
            }]
        }
      })

      var comments = comments.filter(function (el) {
        return el != null
      })

      console.log(comments)


      let readCountQuery = await BoardHelper2.incrementBoardCount(documentId)
      let logging_read = await BoardHelper2.loggingReadLog(memberId, documentId)

      console.log('게시글 조회 완료: ', content[0])
      res.status(201).json({ content: content[0], comments: comments })
    } catch (e) {
      console.log(e)
      res.status(503).send(e)
      throw new Error('게시글 조회 중 오류 발생: ', e)
    }
  },

  GetAllBoardContentOrderByMethod: async (req, res, next) => {
    /**
         * URI: [GET, /api/board/:category/content/]
         * Query String: ...?method=vote
         * method={method}를 기준으로 DESC 정렬 리스트 리턴
         * method가 없을 시 document_id를 기준으로 DESC 정렬 리턴
         * Zeplin: 커뮤니티
         */


    let orderBy = { undefined: 'document_id', 'vote': 'voted_count' }
    let category = req.params.category
    let method = orderBy[req.query.method]

    try {
      let [response] = await pool.query(
        'SELECT `title`, `title` AS `author`, DATE_FORMAT(created_at, \'%m.%d %H:%i\') AS `created_at`, `comment_count` \
                FROM `board_contents` \
                WHERE `board_category` = ? AND `is_visible` = 1 \
                ORDER BY ? DESC', [category, method]
      )


      console.log('게시글 전체 조회 완료: ', response)
      res.status(201).json(response[0])
    } catch (e) {
      res.status(503).send(e)
      throw new Error('게시글 전체 조회 중 오류 발생: ', e)
    }

  },

  postNewBoardContent: async (data) => {
    try {
      let writePost = await pool.execute(
        'INSERT INTO `board_contents` \
        (`board_category`, `member_id`, `title`, `content`, `last_updated_ip` ) \
        VALUES (?, ?, ?, ?, ?) ', [data.board_category, data.member_id, data.title, data.content, data.member_ip]
      )

      let [checkWritingPost] = await pool.query(
        'SELECT * FROM `board_contents` \
        WHERE `document_id`= last_insert_id()'
      )

      console.log('게시글 생성 완료\n', checkWritingPost[0])
      return checkWritingPost[0]
    } catch (e) {
      throw new Error('게시글 생성 중 오류 발생\n', e)
    }
  },
  getPostNewBoardContentDto: async (req) => {
    return {
      'member_id': req.user.member_id,
      'user_ip': faker.internet.ip(),
      // "ip": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      'board_category': req.params.category,
      'title': req.body.title,
      'content': req.body.content,
    }
  },
  editBoardContent: async (data) => {
    try {
      let edit = pool.execute(
        'UPDATE `board_contents` \
        SET `title` = ?, `content` = ?, `last_updated_ip` = ?, `last_updated_id` = ?, \
        `last_updated_date` = CURRENT_TIMESTAMP(), `version` = `version` + 1 \
        WHERE `document_id` = ?',
        [data.title, data.content, data.user_ip, data.member_id, data.document_id])

      let [checkEdited] = await pool.query(
        'SELECT * FROM `board_contents` \
        WHERE `document_id`= ?', [data.document_id])

      console.log('게시글 수정 완료\n', checkEdited[0])
      return checkEdited[0]
    } catch (e) {
      throw new Error('게시글 수정 중 오류 발생\n', e)
    }
  },
  getEditBoardContentDto: async (req) => {
    return {
      'member_id': req.user.member_id,
      'user_ip': faker.internet.ip(),
      'document_id': req.params.documentId,
      // "ip": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      'title': req.body.title,
      'content': req.body.content,
    }
  },
  removeBoardContent: async (data) => {
    try {
      let remove = pool.execute(
        'UPDATE `board_contents` \
        SET `last_updated_ip` = ?, `last_updated_id` = ?, \
        `is_visible` = 0, `last_updated_date` = CURRENT_TIMESTAMP(), `version` = `version` + 1 \
        WHERE `document_id` = ?', [data.user_ip, data.member_id, data.document_id])

      let [checkRemoved] = await pool.query(
        'SELECT * FROM `board_contents` \
        WHERE `document_id`= ?', [data.document_id])

      console.log('게시글 삭제 완료\n', checkRemoved[0])
      return checkRemoved[0]
    } catch (e) {
      throw new Error('게시글 삭제 중 오류 발생\n', e)
    }
  },
  getRemoveBoardContentDto: async (req) => {
    return {
      'member_id': req.user.member_id,
      'user_ip': faker.internet.ip(),
      // "ip": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      'document_id': req.params.documentId,
    }
  },
  voteBoardContent: async (data) => {
    try {
      let vote = await pool.execute(
        'UPDATE `board_contents` \
        SET `'+ data.column_name + '` = `' + data.column_name + '` ' + data.task + ' \
        WHERE `document_id` = ?', [data.document_id]
      )

      // TODO: 좋아요 표시한 게시물 USER TABLE에 기록해야함

      let [checkVoted] = await pool.query(
        'SELECT * FROM `board_contents` \
        WHERE `document_id` = ?', [data.document_id]
      )

      console.log('게시글 추천/비추천 완료\n', checkVoted[0])
      return checkVoted[0]
    } catch (e) {
      throw new Error('게시글 추천/비추천 중 오류 발생\n', e)
    }
  },
  getVoteBoardContentDto: async (req) => {
    return {
      'member_id': req.user.member_id,
      'document_id': req.params.documentId,
      'column_name': req.query.type === 'vote' ? 'voted_count' : 'blamed_count',
      'task': req.query.task === 'up' ? '+ 1' : '- 1',
    }
  },
}
