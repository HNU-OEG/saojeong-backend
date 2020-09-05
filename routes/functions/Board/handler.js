
const BoardHelper = require('../../../Helper/BoardHelper')
const BoardHelper2 = require('../../../Helper/BoardHelper2')
const UserHelper = require('../../../Helper/UserHelper')
const S3Helper = require('../../../Helper/S3Helper')
const pool = require('../../../config/db')

const board_category = {
  '사오정 소식': '10000',
  '문의게시판': '10001',
  '자주하는문의': '10002',
  '공지사항': '10003',
  '자유게시판': '10004'
}

module.exports = {
  ReadMyContent: async (req, res, next) => {
    /**
     * URI: [GET, /api/board/:category/content/my]
     */
    let data = await BoardHelper.getReadMyContentDto(req)
    let myContent = BoardHelper.readMyContent(data)
    myContent
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  ReadBoardContent: async (req, res, next) => {
    /**
     * URI: [GET, /api/board/:category/content/:documentId]
     */
    let data = await BoardHelper.getReadBoardContentDto(req)
    let readBoardContent = BoardHelper.readBoardContent(data)
    readBoardContent
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  ReadAllBoardContents: async (req, res, next) => {
    /**
     * URI: [GET, /api/board/:category/content]
     */
    let data = await BoardHelper.getReadAllBoardContentsDto(req)
    if (data.category === board_category['자유게시판']
      || data.category === board_category['문의게시판']) { // 자유게시판
      let freeBoardContents = BoardHelper.readAllFreeBoardContents(data)
      freeBoardContents
        .then(result => res.status(201).json(result))
        .catch(err => res.status(503).send(err))
    } else if (data.category === board_category['공지사항']
      || data.category === board_category['사오정 소식']
      || data.category === board_category['자주하는문의']) { // 공지사항
      let noticeBoardContents = BoardHelper.readAllNoticeBoardContents(data)
      noticeBoardContents
        .then(result => res.status(201).json(result))
        .catch(err => res.status(503).send(err))
    }
  },
  PostNewSaojeongNews: async (req, res, next) => {
    /**
     * URI: [POST, /api/board/:category/contnet]
     * Request form/data
     * title: "사오정 뉴스",
     * image: 이미지
     */
    if (!S3Helper.checkUploaded(req.file.location)) {
      res.status(503).send('사오정소식 S3 업로드 실패!')
    }

    let data = await BoardHelper.getPostNewNewsDto(req)
    let news = BoardHelper.postNewNews(data)
    news
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))

  },
  PostNewBoardContent: async (req, res, next) => {
    /**
     * URI: [POST, /api/board/:category/content]
     * Request Body: {
     *  "title": "...",
     *  "content": "..."
     * }
     */

    let data = await BoardHelper.getPostNewBoardContentDto(req)

    let postBoardContent = BoardHelper.postNewBoardContent(data)
    postBoardContent
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  EditBoardContent: async (req, res, next) => {
    /**
     * URI: [PUT, /api/board/:category/content/:document_id]
     * Request Body: {
     *  "title": "...",
     *  "content": "..." 
     * }
     */
    let data = await BoardHelper.getEditBoardContentDto(req)
    let editBoardContent = BoardHelper.editBoardContent(data)
    editBoardContent
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  RemoveBoardContent: async (req, res, next) => {
    /**
     * URI: [DELETE, /api/board/:category/content/:documentId]
     */
    let data = await BoardHelper.getRemoveBoardContentDto(req)
    let removeBoardContent = BoardHelper.removeBoardContent(data)
    removeBoardContent
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  VoteBoardContent: async (req, res, next) => {
    /**
     * URI: [PATCH, /api/board/:category/content/:documentId?type=[vote,blame]&task=[up,down]]
     * Query String: ...?type=[vote,blame]&task=[up,down]
     */
    let data = await BoardHelper.getVoteBoardContentDto(req)
    console.log(data)
    let voteBoardContent = BoardHelper.voteBoardContent(data)
    voteBoardContent.then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  PostNewComment: async (req, res, next) => {
    let document_id = req.params.documentId
    let member_id = req.user.member_id
    let comment_author = await UserHelper.checkUserNickname(member_id)
    let comment_content = req.body.content
    let comment_to_comment_id = req.params.pastCommentId || null

    const ipaddr = req.header('x-forwarded-for') || req.connection.remoteAddress

    let content_availability = await BoardHelper2.checkBoardContentAvailability(document_id)
    let member_availability = await UserHelper.checkUserStatus(member_id)

    if (!content_availability) {
      return res.status(401).json({ 'error': '삭제되거나 사용할 수 없는 게시물입니다.' })
    }

    if (!member_availability) {
      return res.status(401).json({ 'error': '탈퇴되거나 정지된 사용자는 댓글을 쓸 수 없습니다.' })
    }

    let data = {
      document_id: document_id,
      member_id: member_id,
      comment_author: comment_author,
      comment_content: comment_content,
      ip_address: ipaddr,
      comment_to_comment_id: comment_to_comment_id
    }

    try {
      if (comment_to_comment_id !== null) {
        let comment = await pool.execute('insert into board_comments (document_id, comment_author, comment_content, comment_author_ip, member_id, comment_parent) values (?,?,?,?,?,?)', [data.document_id, data.comment_author, data.comment_content, data.ip_address, data.member_id, data.comment_to_comment_id])
        let [result] = await pool.query('select comment_content, comment_created_at, users.nickname from users, board_comments where users.member_id = board_comments.member_id and board_comments.comment_id = last_insert_id()')
        console.log(result)
        return res.status(201).json(result[0])
      } else {
        let comment = await pool.execute('insert into board_comments (document_id, comment_author, comment_content, comment_author_ip, member_id) values (?,?,?,?,?)', [data.document_id, data.comment_author, data.comment_content, data.ip_address, data.member_id])
        let [result] = await pool.query('select comment_content, comment_created_at, users.nickname from users, board_comments where users.member_id = board_comments.member_id and board_comments.comment_id = last_insert_id()')
        console.log(result)
        return res.status(201).json(result[0])
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'error': '새 댓글을 쓰지 못했습니다.' })
      throw new Error('새 댓글을 작성하는 중 오류가 발생했습니다.')
    }
  },
  EditComment: async (req, res, next) => {
    let document_id = req.params.documentId
    let member_id = req.user.member_id
    let comment_author = await UserHelper.checkUserNickname(member_id)
    let comment_content = req.body.content
    let target_comment_id = req.params.commentId
    const ipaddr = req.header('x-forwarded-for') || req.connection.remoteAddress

    let content_availability = await BoardHelper2.checkBoardContentAvailability(document_id)
    let member_availability = await UserHelper.checkUserStatus(member_id)


    if (!content_availability) {
      console.log('ERROR: 삭제되거나 사용할 수 없는 게시물입니다.')
      return res.status(401).json({ 'error': '삭제되거나 사용할 수 없는 게시물입니다.' })
    }

    if (!member_availability) {
      console.log('ERROR: 탈퇴되거나 정지된 사용자는 댓글을 쓸 수 없습니다.')
      return res.status(401).json({ 'error': '탈퇴되거나 정지된 사용자는 댓글을 쓸 수 없습니다.' })
    }

    let data = {
      document_id: document_id,
      member_id: member_id,
      comment_id: target_comment_id,
      comment_author: comment_author,
      comment_content: comment_content,
      ip_address: ipaddr,
    }

    if (await BoardHelper2.inspectCommentAuthor(data.comment_id) == member_id) {
      try {
        let editComment = await pool.query('update board_comments set comment_content = ?, comment_author = ? where comment_id = ?', [data.comment_content, data.comment_author, data.comment_id])
        let [result] = await pool.query('select comment_content, comment_created_at, users.nickname from users, board_comments where users.member_id = board_comments.member_id and board_comments.comment_id = ?', [data.comment_id])
        return res.status(201).json(result[0])
      } catch (err) {
        console.log(err)
        res.status(500).json({ 'error': '새 댓글을 쓰지 못했습니다.' })
        throw new Error('새 댓글을 작성하는 중 오류가 발생했습니다.')
      }
    } else {
      return res.status(401).json({ 'error': '자신의 글만 수정할 수 있습니다.' })
    }
  },
  RemoveComment: async (req, res, next) => {
    let document_id = req.params.documentId
    let comment_id = req.params.commentId
    let member_id = req.user.member_id

    let content_availability = await BoardHelper2.checkBoardContentAvailability(document_id)
    let member_availability = await UserHelper.checkUserStatus(member_id)

    if (!content_availability) {
      return res.status(401).json({ 'error': '삭제되거나 사용할 수 없는 게시물입니다.' })
    }

    if (!member_availability) {
      return res.status(401).json({ 'error': '탈퇴되거나 정지된 사용자는 댓글을 지울 수 없습니다.' })
    }

    if (await BoardHelper2.inspectCommentAuthor(comment_id) == member_id) {
      try {
        let [remove] = await pool.execute('update board_comments set is_visible = 0, comment_removed_at = now() where comment_id = ? and member_id = ?', [comment_id, member_id])
        if (remove.affectedRows == 1) {
          return res.status(404).json({
            'status': 'Removed Comment.'
          })
        } else {
          res.status(400).json({ 'error': '댓글을 삭제할 수 없습니다.' })
        }
      } catch (error) {
        console.log(error)
        res.status(401).json({ 'error': '댓글을 삭제할 수 없습니다.' })
        throw new Error('댓글을 삭제할 수 없습니다.')
      }
    }
  },
  SearchBoard: async (req, res, next) => {
    let type = req.query.type
    let query = req.query.value
    let category = req.query.category

    if (query.length <= 2) {
      return res.status(200).json({ 'result': '검색어는 최소 3자리부터 입력해야 합니다.' })
    }

    let variable = `%${query}%`

    if (type == 'board') {
      try {
        let [result] = await pool.query('SELECT b.document_id, b.title, b.`content`, u.nickname AS author, DATE_FORMAT(b.created_at, \'%m.%d %H:%i\') AS created_at, b.voted_count, ifnull(count(comment_id),0) AS comment_count \
        FROM board_contents AS `b` \
        JOIN `users` AS u ON u.`member_id` = b.member_id \
        LEFT OUTER JOIN `board_comments` AS bc ON bc.document_id = b.document_id \
        WHERE b.member_id = u.member_id AND b.is_visible = 1 AND b.board_category = ? AND b.content LIKE ? \
        GROUP BY b.document_id \
        ORDER BY b.created_at DESC', [category, variable])
        if (result.length == 0) {
          return res.status(200).json({ 'result': '조건에 맞는 결과가 없습니다.' })
        }
        return res.status(200).json({ normal: result })
      } catch (err) {
        throw new Error('게시판을 검색할 수 없습니다.')
      }
    } else if (type == 'store') {
      try {
        let [result] = await pool.query('SELECT store_indexholder, store_name, store_type, store_master \
        FROM store_information \
        WHERE store_name LIKE ? OR store_type LIKE ? OR store_master ? group by store_id', [variable, variable, variable])
        if (result.length == 0) {
          return res.status(200).json({ 'result': '조건에 맞는 결과가 없습니다.' })
        }
        return res.status(200).json({ result: result })
      } catch (err) {
        throw new Error('스토어를 검색할 수 없습니다.')
      }
    } else {
      return res.status(200).json({ 'result': '조건을 입력하지 않았습니다.' })
    }
  },
}
