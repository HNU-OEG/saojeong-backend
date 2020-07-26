const express = require('express');
const router = express.Router();
const faker = require('faker');
const UserHelper = require('../../../Helper/UserHelper');
const Models = require('../../../config/db');

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
            const user = await Models.users_model.create(data)
        } catch (err) {
            throw new Error("사용자 생성 중 오류 발생", err, data);
        }



        res.send(201)
    },
    CreatePhoneSession: async (req, res, next) => {
        faker.locale = 'ko'
        for (let index = 12; index < 70; index++) {
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

            console.log(data)


            try {
                const session = await Models.sessions_model.create(data)
                console.log(session)
            } catch (err) {
                console.log(err)
                throw new Error("사용자 생성 중 오류 발생", err, data);
            } finally {
                continue;
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