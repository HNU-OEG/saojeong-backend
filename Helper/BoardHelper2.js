const pool = require('../config/db')

module.exports = {
  checkBoardContentAvailability: async (document_id) => {
    try {
      let [status] = await pool.query('select is_visible as status from board_contents where document_id = ?', [document_id])
      if (!status == 1) {
        return false
      }
      return true
    } catch {
      throw new Error('Board Content 의 상태를 조회하는데에 실패했습니다.')
    }
  },
  inspectCommentAuthor: async (comment_id) => {
    try {
      let [user] = await pool.query('select member_id from board_comments where comment_id = ?', [comment_id])
      if (user.length == 1) {
        return user[0].member_id
      } else {
        return false
      }
    } catch (err) {
      throw new Error('Comment Author를 조회하지 못했습니다.')
    }
  }
}