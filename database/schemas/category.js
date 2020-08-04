let dynamoose = require('../dynamodb')
let Schema = dynamoose.Schema

module.exports = new Schema({
  name: {
    type: String,
    required: true,
    hashKey: true
  },
  categoryCode: {
    type: Number,
    required: true,
    rangeKey: true,
    index: {
      global: true,
      name: 'categoryCode-index'
    }
  }
})