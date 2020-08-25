const dynamoose = require('../dynamodb')
const schema = require('../schemas/event-products-create')
const Event = dynamoose.model('event-products-create', schema)
const uuid = require('uuid')
module.exports = {
  model: Event,
  createPriceSet: async (priceset, categoryCode, regDate) => {
    var _priceset = {}
    _priceset.id = await uuid.v1()
    _priceset.categoryCode = categoryCode
    _priceset.regDate = regDate
    _priceset.kamisProductJSON = priceset
    let newPriceSet = new Event(_priceset)
    return newPriceSet.save().then(data => {
      return data
    })
      .catch(err => {
        throw err
      })
  },
  getParse: async () => {
    return Event.scan('id').exec().then(data => {
      return data[0]
    })
      .catch(err => {
        throw err
      })
  },
  getAllParseData: async () => {
    // 한번에 가져오는 개수 50으로 수정 (너무 많으면 한번에 처리가 불가능함, timeout 180초)
    const events = await Event.scan().limit(200).exec()
    return events
  }
}