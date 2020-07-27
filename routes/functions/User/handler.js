const express = require('express');
const router = express.Router();
const faker = require('faker');
const UserHelper = require('../../../Helper/UserHelper');
const pool = require('../../../config/db');
const jwt = require('jsonwebtoken');
const passport = require('../../../config/passport')

module.exports = {
    ClaimNewGuestUser: async (req, res, next) => {
        let nickname = await UserHelper.generateGuestNickname();
        let type = 1;
        const gender = req.body.gender || '';
        const enabled = 1;
        const ipaddr = req.header('x-forwarded-for') || req.connection.remoteAddress

        let data = {
            username: '',
            nickname: nickname,
            type: type,
            gender: gender,
            enabled: enabled,
            ipaddr: ipaddr
        }

        try {
            const user = await pool.execute("insert into users (username, nickname, gender, type, enabled, last_updated_ip) values (?,?,?,?,?,?)", [data.username, data.nickname, data.gender, data.type, data.enabled, data.ipaddr]);
            const [result] = await pool.query("select member_id, username, nickname, gender, created_at from users where member_id=last_insert_id()")
            console.log(result)
            const token = jwt.sign(JSON.stringify(result[0]), process.env.JWT_SECRET);
            return res.status(201).json({ result, token })
        } catch (err) {
            console.log(err)
            res.status(503).json({ "result": "error" });
            throw new Error("사용자 생성 중 오류 발생", err);
        }
    },
    // CreateJWTToken: async (req, res, next) => {
    //     passport.authenticate('jwt', { session: false }, (err, user) => {
    //         if (err || !user) {
    //             return res.status(400).json({
    //                 message: 'Something is not right',
    //                 user: user
    //             });
    //         }
    //         req.login(user, { session: false }, (err) => {
    //             if (err) {
    //                 res.send(err);
    //             }
    //             // jwt.sign('token내용', 'JWT secretkey')
    //             const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
    //             return res.json({ user, token });
    //         });
    //     });
    // },
    EditUserInfomation: async (req, res, next) => {
        let member_id = req.params.member_id; // 파라미터의 사용자 id
        let auth_member_id = req.user.member_id; // jwt의 사용자 id

        if (!member_id == auth_member_id) {
            return res.status(503).json({ "result": "error", "message": "인증되지 않은 사용자입니다." });
        } else {
            let nickname = req.body.nickname;
            let userphoto = req.body.userphoto;
            const ipaddr = req.header('x-forwarded-for') || req.connection.remoteAddress
            var data = {
                nickname: nickname,
                userphoto: userphoto,
                ip: ipaddr
            }

            try {
                let user = await pool.execute("INSERT INTO users ( nickname, last_updated_id, last_updated_ip ) SELECT ?, ?, ? FROM users WHERE member_id = ?", [data.nickname, member_id, data.ip, member_id]);
                const [result] = await pool.query("select member_id, username, nickname, gender, created_at from users where member_id=last_insert_id()")
                const token = jwt.sign(JSON.stringify(result[0]), process.env.JWT_SECRET);
                console.log(token)
                return res.json(201, { result, token })
            } catch (err) {
                console.log(err)
                res.status(503).json({ "result": "error" });
                throw new Error("사용자 정보 변경에 실패하였습니다.", err);
            }

        }

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
                const user = await pool.execute("insert into users (username, nickname, gender, email, last_updated_ip, type) values (?,?,?,?,?,?) ", [data.username, data.nickname, data.gender, data.email, data.last_updated_ip, data.type]);
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

    },


}