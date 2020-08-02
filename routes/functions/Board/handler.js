const express = require('express')
const router = express.Router()

const BoardHelper = require('../../../Helper/BoardHelper')
const faker = require('faker/locale/ko')
const BoardHelper2 = require('../../../Helper/BoardHelper2')
const UserHelper = require('../../../Helper/UserHelper')
const pool = require('../../../config/db')

module.exports = {
  WritePost: async (req, res, next) => {
    /**
     * URI: [POST, /api/board/:category/content]
     * Request Body: {
     *  "title": "...",
     *  "article": "..."
     * }
     */
    let data = await BoardHelper.getWritePostDto(req)
    let insertPost = BoardHelper.createBoardContent(data)
    insertPost.then(result => res.status(201).json(result))
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
      return res.status(401).json({ 'error': '삭제되거나 사용할 수 없는 게시물입니다.' })
    }

    if (!member_availability) {
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

    let variable = '%${query}%'

    if (type == 'board') {
      try {
        let [result] = await pool.query('SELECT board_contents.title, board_contents.content, board_contents.created_at FROM boards, board_contents, board_comments WHERE boards.board_id = board_contents.board_category AND board_contents.document_id = board_comments.`document_id` AND (board_contents.content LIKE ? OR board_comments.`comment_content` LIKE ?) GROUP BY board_contents.document_id', [variable, variable])
        if (result.length == 0) {
          return res.status(200).json({ 'result': '조건에 맞는 결과가 없습니다.' })
        }
        return res.status(200).json({ result: result })
      } catch (err) {
        throw new Error('게시판을 검색할 수 없습니다.')
      }
    }
  }
}
