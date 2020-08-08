const dynamoose = require('dynamoose')
const Event = require('../../../database/models/event-products-create')
const Product = require('../../../database/models/wholesale-products')
const fetch = require('node-fetch')
const { generateURLbyQueryString, getToday } = require('../utils')
const { Location, Category } = require('../../../config/product-attributes')
const _ = require('lodash')

module.exports.kamisSync = async (req, res, next) => {

  let kamis_daily = {
    'action': 'dailyPriceByCategoryList',
    'p_cert_id': process.env.KAMIS_CERT_NAME_ENV,
    'p_cert_key': process.env.KAMIS_CERT_KEY_ENV,
    'p_returntype': 'json',
    'p_convert_kg_yn': 'Y', // Y: Convert 1kg, N: Inspector's Inspection Unit
    'p_product_cls_code': '01', // 01: Retail, 02: Wholesale
    'p_item_category_code': 200,
    'p_country_code': Location.Retail.Daejeon,
    'p_regday': getToday()
  }
  let base_url = await generateURLbyQueryString('http://www.kamis.or.kr/service/price/xml.do', kamis_daily)
  var response = await fetch(base_url)
  if (response.status === 200) {
    response = await response.json()
    let data = response.data.item

    var res_data = data.map(element => {
      return {
        id: Number(element.item_code + element.kind_code),
        ...element
      }
    })

    res_data = _.toArray(res_data)


    try {
      let result = await Event.createPriceSet(res_data, kamis_daily.p_item_category_code, kamis_daily.p_regday)
      return res.status(200).json({ 'result': 'ok' })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ 'result': 'failed' })
    }
  } else {
    throw new Error('Fetching KAMIS Price trends failed ')
  }
}

module.exports.eventSync = async (req, res, next) => {
  let eventsync = await Event.getParse()
  let date = eventsync.regDate
  let kamis_data = eventsync.kamisProductJSON
  kamis_data.map(element => {
    var _elem = { ...element, date }
    let save = Product.format(_elem)
    console.log(save)
  })
}