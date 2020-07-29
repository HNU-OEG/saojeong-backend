const faker = require('faker/locale/ko');
const pool = require('../config/db');

module.exports = {
    CreateStore: async (req, res, next) => {
        /**
         * URI: [POST, /api/store]
         */

        // let userId = req.passport.userId;
        let userId = 18;
        let storeName = faker.company.companyName();
        let storeIndexHolder = 1;
        let storeMaster = userId;
        let storeType = ["과일", "채소", "수산"];
        try {

            let query = await pool.query(
                "INSERT INTO `store_information` \
                (`store_indexholder`, `store_name`, `store_type`, `store_master`) \
                VALUES (?, ?, ?, ?)", [storeIndexHolder, storeName, storeType[0], storeMaster]
            );

            let [response] = await pool.query(
                "SELECT * FROM `store_information` \
                WHERE `store_id`= last_insert_id()"
            );

            console.log("상점 생성 완료: ", response[0]);
            res.status(201).json(response[0]);
        } catch (e) {
            res.status(503).send(e);
            throw new Error("상점 생성 중 오류 발생");
        }
    },

    CreateStoreOpeningTime: async (req, res, next) => {
        /**
         * URI: [POST, /api/store/time]
         */
        // Opening Times
        let storeId = 1;
        let weekday = { "sun": 1, "mon": 2, "tue": 3, "wed": 4, "thu": 5, "fri": 6, "sat": 7 };
        let start_hour = "9:00";
        let end_hour = "20:00";

        try {

            for (let i = 1; i <= 7; i++) {
                let query = await pool.query(
                    "INSERT INTO `store_opening_hours` \
                    (`store_id`, `weekday`, `start_hour`, `end_hour`) \
                    VALUES (?, ?, TIME(?), TIME(?))", [storeId, i, start_hour, end_hour]
                );
            }

            let [response] = await pool.query(
                "SELECT `weekday`, `start_hour`, `end_hour` FROM `store_opening_hours` \
                WHERE `store_id`= ?", [storeId]
            );

            console.log("상점 영업 시간 생성 완료: ", response);
            res.status(201).json(response);
        } catch (e) {
            res.status(503).send(e);
            throw new Error("상점 영업 시간 생성 중 오류 발생");
        }
    },

    CreateStoreMerchandise: async (req, res, next) => {
        /**
         * URI: [POST, /api/store/merchandise]
         */


        let storeId = 1;
        try {

            for (let i = 1; i <= 7; i++) {
                let name = faker.name.lastName();
                let price = faker.commerce.price();
                let lastUpdatedIp = faker.internet.ip();

                let query = await pool.query(
                    "INSERT INTO `store_merchandise` \
                    (`store_id`, `name`, `price`, `last_updated_ip`) \
                    VALUES (?, ?, ?, ?)", [storeId, name, price, lastUpdatedIp]
                );
            }

            let [response] = await pool.query(
                "SELECT `name`, `price` FROM `store_merchandise` \
                WHERE `store_id`= ?", [storeId]
            );

            console.log("상품 등록 완료: ", response);
            res.status(201).json(response);
        } catch (e) {
            res.status(503).send(e);
            throw new Error("상품 등록 중 오류 발생");
        }

    },

    CreateStoreTelePhone: async (req, res, next) => {
        /**
         * URI: [POST, /api/store/telephone]
         */
        let storeId = 1;

        try {

            for (let i = 1; i <= 7; i++) {
                let telephone = faker.phone.phoneNumber();

                let query = await pool.query(
                    "INSERT INTO `store_telephone` \
                    (`store_id`, `telephone`) \
                    VALUES (?, ?)", [storeId, telephone]
                );
            }

            let [response] = await pool.query(
                "SELECT `telephone`, `is_verified` FROM `store_telephone` \
                WHERE `store_id`= ?", [storeId]
            );

            console.log("상품 등록 완료: ", response);
            res.status(201).json(response);
        } catch (e) {
            res.status(503).send(e);
            throw new Error("상품 등록 중 오류 발생");
        }
    }
}