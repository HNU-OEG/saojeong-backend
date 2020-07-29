const faker = require('faker/locale/ko');
const pool = require('../config/db');


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
        let ip = faker.internet.ip();
        // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // localhost에서는 동작 안함

        try {
            let query = await pool.query(
                "INSERT INTO `boards` (`name`, `ip_addr`) \
                VALUES (?, ?) ", [name, ip]
            );

            let [response] = await pool.query(
                "SELECT * FROM `boards` \
                WHERE `board_id`= last_insert_id()"
            );

            console.log("게시판 생성 완료: ", response[0]);
            res.status(201).json(response[0]);
        } catch (e) {
            res.status(503).send(e);
            throw new Error("게시판 생성 중 오류 발생");
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

        let memberId = 18;
        // let memberId = req.passport.user;
        let documentId = req.params.documentId;

        try {
            let [response] = await pool.query(
                "SELECT c.document_id, c.title, c.content, DATE_FORMAT(c.created_at, '%m.%d %H:%i') AS created_at, b.name AS category, u.nickname AS author \
                FROM `board_contents` AS `c` \
                INNER JOIN `boards` AS `b` ON c.board_category = b.board_id \
                INNER JOIN `users` AS `u` ON c.member_id = u.member_id \
                WHERE c.document_id = ?", [documentId]
            );

            let readCountQuery = await pool.query(
                "UPDATE `board_contents` \
                SET `readed_count` = `readed_count` + 1 \
                WHERE `document_id` = ?", [documentId]
            );

            let readLogQuery = await pool.query(
                "INSERT INTO  `board_read_log` (`member_id`, `document_id`) \
                VALUES (?, ?)" [memberId, documentId]);

            console.log("게시글 조회 완료: ", response[0]);
            res.status(201).json(response[0]);
        } catch (e) {
            res.status(503).send(e);
            throw new Error("게시글 조회 중 오류 발생: ", e);
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


        let orderBy = { undefined: "document_id", "vote": "voted_count" }
        let category = req.params.category;
        let method = orderBy[req.query.method];

        try {
            let [response] = await pool.query(
                "SELECT `title`, `title` AS `author`, DATE_FORMAT(created_at, '%m.%d %H:%i') AS `created_at`, `comment_count` \
                FROM `board_contents` \
                WHERE `board_category` = ? AND `is_visible` = 1 \
                ORDER BY ? DESC", [category, method]
            );


            console.log("게시글 전체 조회 완료: ", response);
            res.status(201).json(response[0]);
        } catch (e) {
            res.status(503).send(e);
            throw new Error("게시글 전체 조회 중 오류 발생: ", e);
        }

    },

    CreateBoardContent: async (req, res, next) => {
        /**
         * URI: [POST, /api/board/:category/content]
         * Request Body: {
         *   "member_id": 1,
         *   "content": {
         *     "title": "TEST01",
         *     "content": "TEST0001"
         *     }
         *   }
         */

        let memberId = req.body.member_id;
        let boardCategory = req.params.category;
        let title = req.body.content.title;
        let content = req.body.content.content;
        // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let ip = faker.internet.ip();

        try {
            let query = await pool.query(
                "INSERT INTO `board_contents` \
                (`board_category`, `member_id`, `title`, `content`, `last_updated_ip` ) \
                VALUES (?, ?, ?, ?, ?) ", [boardCategory, memberId, title, content, ip]
            );

            let [response] = await pool.query(
                "SELECT * FROM `board_contents` \
                WHERE `document_id`= last_insert_id()"
            );

            console.log("게시글 생성 완료: ", response[0]);
            res.status(201).json(response[0]);
        } catch (e) {
            res.send(503, e);
            throw new Error("게시글 생성 중 오류 발생: ", e);
        }
    },

    UpdateBoardContent: async (req, res, next) => {
        /**
         * URI: [PUT, /api/board/:category/content/:documentId]
         * Request Body: {
         *   "member_id": 1,
         *   "content": {
         *     "title": "title",
         *     "content": "content"
         *   }
         * }
         */

        let memberId = req.body.member_id;
        let boardCategory = req.params.category;
        let documentId = req.params.documentId;
        let title = req.body.content.title;
        let content = req.body.content.content;
        // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let ip = faker.internet.ip();

        try {
            let query = await pool.query(
                "INSERT INTO `board_contents` \
                (`board_category`, `member_id`, `title`, `content`, `last_updated_ip`, `last_updated_id` ) \
                VALUES (?, ?, ?, ?, ?, ?) ", [boardCategory, memberId, title, content, ip, documentId]
            );

            let [response] = await pool.query(
                "SELECT * FROM `board_contents` \
                WHERE `document_id`= last_insert_id()"
            );

            console.log("게시글 수정 완료: ", response[0]);
            res.status(201).json(response[0]);
        } catch (e) {
            res.send(503, e);
            throw new Error("게시글 수정 중 오류 발생: ", e);
        }
    },

    DeleteBoardContent: async (req, res, next) => {
        /**
         * URI: [DELETE, /api/board/:category/content/:documentId]
         */
        let documentId = req.params.documentId;
        let isVisible = 0;
        // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let ip = faker.internet.ip();

        try {
            let query = await pool.query(
                "UPDATE `board_contents` \
                SET `is_visible` = ?, `last_updated_ip` = ?, `last_updated_date` = CURRENT_TIMESTAMP() \
                WHERE `document_id` = ?", [isVisible, ip, documentId]
            );

            let [response] = await pool.query(
                "SELECT * FROM `board_contents` \
                WHERE `document_id` = ?", [documentId]
            );

            console.log("게시글 삭제 완료: ", response[0]);
            res.status(201).json(response[0]);
        } catch (e) {
            res.send(503, e);
            throw new Error("게시글 삭제 중 오류 발생: ", e);
        }
    },

    PatchBoardContentVoteOrBlame: async (req, res, next) => {
        /**
         * URI: [PATCH, /api/board/:category/content/:documentId]
         * Query String: ...?type=[vote,blame]&task=[up,down]
         */
        let documentId = req.params.documentId;
        let columnName = req.query.type === "vote" ? "voted_count" : "blamed_count"
        let task = req.query.task === "up" ? "+ 1" : "- 1";

        try {
            let query = await pool.query(
                "UPDATE `board_contents` \
                SET `"+ columnName +"` = `" + columnName +"` " + task + " \
                WHERE `document_id` = ?", [documentId]
            );

            // TODO: 좋아요 표시한 게시물 USER TABLE에 기록해야함

            let [response] = await pool.query(
                "SELECT * FROM `board_contents` \
                WHERE `document_id` = ?", [documentId]
            );

            console.log("추천/비추천 업데이트 완료: ", response[0]);
            res.status(201).json(response[0])
        } catch (e) {
            res.status(503).send(e);
            throw new Error("추천/비추천 업데이트 중 오류 발생: ", e);
        }

    }
};

