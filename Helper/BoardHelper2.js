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
  }
}