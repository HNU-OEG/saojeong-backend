const dynamoose = require('dynamoose')
const Event = require('../../../database/models/event-products-create')
const Product = require('../../../database/models/wholesale-products')
const fetch = require('node-fetch')
const { generateURLbyQueryString, getToday } = require('../utils')
const { Location, Category } = require('../../../config/product-attributes')
const _ = require('lodash')
const { getAllParseData } = require('../../../database/models/event-products-create')
const { PickBy1Weeks, PickBy3Weeks } = require('../../../Helper/SyncHelper')
const moment = require('moment')
const leftPad = require('left-pad')

module.exports.kamisSync = async (req, res, next) => {
  let p_regday = req.query.date || getToday()
  let month = req.query.month // month date must be YYYY-MM

  if (month != null) {
    let DaysOfMonth = moment(month, 'YYYY-MM').daysInMonth()
    for (let index = 1; index < DaysOfMonth + 1; index++) {
      // 이 코드 수정할 때는 아래의 블럭도 같이 수정할 것..
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
          'p_regday': month + '-' + leftPad(index, 2, '0')
        }

        let base_url = await generateURLbyQueryString('http://www.kamis.or.kr/service/price/xml.do', kamis_daily)
        var response = await fetch(base_url).then(x => new Promise(resolve => setTimeout(() => resolve(x), 1000)))

        if (response.status === 200) {
          response = await response.json()
          let data = response.data.item

          if (response.data.length < 2) {
            console.info('No Data Received, it may sunday or holiday')
            // res.status(404).json({ result: 'Error', details: 'No Data from KAMIS Server. Try later :)' })
            return false
          }

          var res_data = data.map(element => {
            return {
              id: Number(element.item_code + element.kind_code + element.rank_code),
              ...element
            }
          })

          res_data = _.toArray(res_data)

          try {
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
    }
  } else {
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
        'p_regday': p_regday
      }

      let base_url = await generateURLbyQueryString('http://www.kamis.or.kr/service/price/xml.do', kamis_daily)
      var response = await fetch(base_url)
      if (response.status === 200) {
        response = await response.json()
        let data = response.data.item

        if (response.data.length < 2) {
          console.log('No Data!!')
          // res.status(404).json({ result: 'Error', details: 'No Data from KAMIS Server. Try later :)' })
          return false
        }

        var res_data = data.map(element => {
          return {
            id: Number(element.item_code + element.kind_code + element.rank_code),
            ...element
          }
        })

        res_data = _.toArray(res_data)

        console.log('res_data :>> ', res_data)
        try {
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
  }

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

module.exports.GetPrice = async (req, res, next) => {
  let product_code = Number(req.params.product_code)
  let trends = await Product.getPriceInfomationById(product_code)
  var data = []
  trends.map(elem => {
    data.push({
      date: moment(elem.date).format('MM/DD'),
      itemName: elem.itemName,
      unit: elem.unit,
      rank: elem.rank,
      kindName: elem.kindName
    })
  })

  console.log('data :>> ', data)
  res.json(data)
}

module.exports.GetWeeklyTrends = async (req, res, next) => {
  let product_code = Number(req.params.product_code)
  let week_timestamp = await PickBy1Weeks
  let trends = []
  for (const [key, time] of Object.entries(week_timestamp())) {
    let [query] = await Product.getPriceInfomationByIdAndTimestamp(product_code, time)
    trends.push(query)
  }

  console.log('trends :>> ', trends)


  var data = []

  for (let index = 0; index < trends.length - 1; index++) {
    const elem = trends[index]
    data.push({
      date: moment(elem.date).format('MM/DD'),
      itemName: elem.itemName,
      unit: elem.unit,
      rank: elem.rank,
      kindName: elem.kindName
    })
  }
  return res.json(data)
}

module.exports.Get3WeeklyTrends = async (req, res, next) => {
  let product_code = Number(req.params.product_code)
  let week_timestamp = await PickBy3Weeks
  let trends = []
  for (const [key, time] of Object.entries(week_timestamp())) {
    let [query] = await Product.getPriceInfomationByIdAndTimestamp(product_code, time)
    trends.push(query)
  }

  console.log('trends :>> ', trends)


  var data = []

  for (let index = 0; index < trends.length - 1; index++) {
    const elem = trends[index]
    data.push({
      date: moment(elem.date).format('MM/DD'),
      itemName: elem.itemName,
      unit: elem.unit,
      rank: elem.rank,
      kindName: elem.kindName
    })
  }
  return res.json(data)
}