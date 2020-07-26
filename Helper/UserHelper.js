const pool = require('../config/db');

module.exports = {
    checkUserAvailablebyMemberID: async (member_id) => {
        try {
            let [result] = await pool.query('select member_id from users where member_id = ?', [member_id])
            if (result.length == 0) {
                return false;
            } else {
                return true;
            }
        } catch (err) {
            console.log(err);
            throw new Error("MemberID를 조회하는 중에 오류가 발생하였습니다.");
        }
    },
}