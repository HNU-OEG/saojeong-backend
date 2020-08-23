const dynamoose = require('dynamoose')
const Event = require('../../../database/models/event-products-create')
const Product = require('../../../database/models/wholesale-products')
const fetch = require('node-fetch')
const { generateURLbyQueryString, getToday } = require('../utils')
const { Location, Category } = require('../../../config/product-attributes')
const _ = require('lodash')
const { getAllParseData } = require('../../../database/models/event-products-create')

module.exports.kamisSync = async (req, res, next) => {
  Object.keys(Category).map(async category => {
    let kamis_daily = {
      'action': 'dailyPriceByCategoryList',
      'p_cert_id': process.env.KAMIS_CERT_NAME_ENV,
      'p_cert_key': process.env.KAMIS_CERT_KEY_ENV,
      'p_returntype': 'json',
      'p_convert_kg_yn': 'Y', // Y: Convert 1kg, N: Inspector's Inspection Unit
      'p_product_cls_code': '01', // 01: Retail, 02: Wholesale
      'p_item_category_code': Number(category),
      'p_country_code': Location.Retail.Daejeon,
      // 'p_regday': getToday()
      'p_regday': '2020-08-20'
    }
    let base_url = await generateURLbyQueryString('http://www.kamis.or.kr/service/price/xml.do', kamis_daily)
    var response = await fetch(base_url)
    if (response.status === 200) {
      response = await response.json()
      let data = response.data.item

      if (response.data.length < 1) {
        console.log('No Data!!')
        // res.status(404).json({ result: 'Error', details: 'No Data from KAMIS Server. Try later :)' })
        return false
      }

      var res_data = data.map(element => {
        return {
          id: Number(element.item_code + element.kind_code),
          ...element
        }
      })

      res_data = _.toArray(res_data)

      try {
        await sleep(200)
        let result = await Event.createPriceSet(res_data, kamis_daily.p_item_category_code, kamis_daily.p_regday)
        console.log('카테고리 저장완료 :>> ', category)
      } catch (err) {
        console.log('카테고리 저장 중 오류발생 :>> ', err)
        // return res.status(400).json({ 'result': 'failed' })
      }
    } else {
      throw new Error('Fetching KAMIS Price trends failed ')
    }
  })

  return res.status(200).json({ 'result': '데이터 가져오기 완료.' })
}

module.exports.eventSync = async (req, res, next) => {
  const events = await Event.getAllParseData()

  events.forEach(async _Event => {
    // Event ID 조회
    let eventId = _Event.id
    let date = new Date(_Event.regDate)
    let kamis_data = _Event.kamisProductJSON

    // get merchandise from event-product-sync
    kamis_data.forEach(async elem => {
      var merchandise = { ...elem, date }
      var Merchandise = Product.format(merchandise)
      console.log('Merchandise :>> ', Merchandise)
      try {
        let result = Product.create(Merchandise)
        return result
      } catch (err) {
        console.log('Error while processing Event ==> ', err, Merchandise)
      }
    })

    // cleanup process remove event
    let removeEvent = await Event.model.delete({ id: eventId })
  })

  return res.status(201).json({ 'result': 'ok' })

  // // 데이터를 하나씩 스캔
  // let _Event = await Event.getParse()

  // // Event ID 조회
  // let eventId = _Event.id
  // let date = new Date(_Event.regDate)
  // let kamis_data = _Event.kamisProductJSON

  // // get merchandise from event-product-sync
  // kamis_data.forEach(async elem => {
  //   var merchandise = { ...elem, date }
  //   var Merchandise = Product.format(merchandise)
  //   console.log('Merchandise :>> ', Merchandise)
  //   try {
  //     let result = Product.create(Merchandise)
  //     return result
  //   } catch (err) {
  //     console.log('ERRRRR=====>', err, Merchandise)
  //   }
  // })

  // // cleanup process remove event
  // let removeEvent = await Event.model.delete({ id: eventId })

  // return res.status(201).json({ 'result': 'ok' })
}