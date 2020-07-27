const pool = require('../config/db');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises
const path = require('path')
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
    generateGuestNickname: async () => {

        try {
            const result = await fs.readFile(path.join(__dirname, 'dictionary.txt'), 'utf8');
            var d = result.split("\n")
            var item = d[Math.floor(Math.random() * d.length)];
            nickname = "익명의 " + item
            return nickname
        } catch (e) {
            console.error(e);
        }
    }
}