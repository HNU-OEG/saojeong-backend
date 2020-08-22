var express = require('express')
var router = express.Router()
const SeasonalHandler = require('./functions/Seasonal/handler.js')
let upload = require('../config/s3')

router.get('/type/:type/month/:month/',  SeasonalHandler.ReadSeasonalFood)
router.post('/type/:type/month/:month/', upload('seasonal_food').single('image'), SeasonalHandler.PostSeasonalFood)

module.exports = router