const express = require('express')
const router = express.Router()
const BoardHelper2 = require('../../../Helper/BoardHelper2')
const UserHelper = require('../../../Helper/UserHelper')
const pool = require('../../../config/db')

module.exports = {
  PostNewComment: async (req, res, next) => {
    let document_id = req.params.documentId
    // let member_id = req.user.member_id
    let member_id = 300
    let comment_author = await UserHelper.checkUserNickname(member_id)
    let comment_content = req.body.content
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
      ip_address: ipaddr
    }

    try {
      let comment = await pool.execute('insert into board_comments (document_id, comment_author, comment_content, comment_author_ip, member_id) values (?,?,?,?,?)', [data.document_id, data.comment_author, data.comment_content, data.ip_address, data.member_id])
      let [result] = await pool.query('select comment_content, comment_created_at, users.nickname from users, board_comments where users.member_id = board_comments.member_id and board_comments.comment_id = last_insert_id()')
      console.log(result)
      return res.status(201).json(result[0])
    } catch (err) {
      console.log(err)
      res.status(500).json({ 'error': '새 댓글을 쓰지 못했습니다.' })
      throw new Error('새 댓글을 작성하는 중 오류 발생.')
    }
  }
}
