const express = require('express')
const router = express.Router()
const BoardHelper = require('../../../Helper/BoardHelper')
const faker = require('faker/locale/ko')

module.exports = {
  WritePost: async (req, res, next) => {
    /**
     * URI: [POST, /api/board/:category/content]
     * Request Body: {
     *  "title": "...",
     *  "article": "..."
     * }
     */
    let data = await BoardHelper.getWritePostDto(req)
    let insertPost = BoardHelper.createBoardContent(data)
    insertPost.then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },

}
