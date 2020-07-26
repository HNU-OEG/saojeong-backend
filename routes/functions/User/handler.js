const express = require('express');
const router = express.Router();
const faker = require('faker');
const UserHelper = require('../../../Helper/UserHelper');
const pool = require('../../../config/db');

module.exports = {
    CreateNewGuestUser: async (req, res, next) => {
        let username = await UserHelper.CheckUsername(req.body.username);
        let nickname = req.body.nickname;
        let password = "";
        let email = req.body.email;
        let type = 1;
        const gender = req.body.gender || '';
        const enabled = 1;
    },

    // 폰은정....
    CreatePhoneUser: async (req, res, next) => {
        faker.locale = 'ko'
        for (let index = 0; index < 100; index++) {

            let name = faker.name.findName();
            let nickname = faker.commerce.productName()
            let gender = 1
            let email = faker.internet.email();
            let last_updated_ip = faker.internet.ip();
            let type = 1;


            let data = {
                username: name,
                nickname: nickname,
                gender: 1,
                email: email,
                last_updated_ip: last_updated_ip,
                type: type
            }



            try {
                const user = await pool.query("insert into users (username, nickname, gender, email, last_updated_ip, type) values (?,?,?,?,?,?) ", [data.username, data.nickname, data.gender, data.email, data.last_updated_ip, data.type]);
            } catch (err) {
                throw new Error("사용자 생성 중 오류 발생", err, data);
            } finally {
                continue;
            }


        }

        res.send(201)
    },
    CreatePhoneSession: async (req, res, next) => {
        faker.locale = 'ko'
        for (let index = 1; index < 300; index++) {
            let member_id = index;
            let session_key = faker.random.number();
            let session_value = faker.random.uuid();
            let session_ip = faker.internet.ip();
            let last_updated = faker.date.future();


            let data = {
                member_id: member_id,
                session_key: session_key,
                session_value: session_value,
                session_ip: session_ip,
                last_updated: last_updated
            }

            if (await UserHelper.checkUserAvailablebyMemberID(data.member_id)) {
                try {
                    const session = await pool.execute("insert into sessions (member_id, session_key, session_value, session_ip, last_updated) values (?,?,?,?,?)", [data.member_id, data.session_key, data.session_value, data.session_ip, data.last_updated])
                    console.log(session)
                } catch (err) {
                    console.log(err)
                    throw new Error("사용자 생성 중 오류 발생", err, data);
                } finally {
                    continue;
                }
            }




        }


        res.send(201)
    },
    CheckRelation: async (req, res, next) => {
        try {
            const user = await Models.sessions_model.findOne({ include: Models.users_model }).then(result => result.dataValues);
            console.log(user)
        } catch (e) {
            console.log(e)
        }
    }


}