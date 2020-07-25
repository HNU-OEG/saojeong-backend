const express = require('express');
const router = express.Router();
const UserHelper = require('../../../Helper/UserHelper');

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
}