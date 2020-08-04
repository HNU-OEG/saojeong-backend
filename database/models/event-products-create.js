const dynamoose = require('../dynamodb')
const schema = require('../schemas/event-products-create')
const Event = dynamoose.model('event-products-create', schema)

module.exports = {
  model: Event,
  createPriceSet: async (priceset) => {
    let newPriceSet = new Event(priceset)
    return newPriceSet.save().then(data => {
      return data
    })
  }
}