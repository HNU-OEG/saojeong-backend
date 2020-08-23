let dynamoose = require('../dynamodb')
let Schema = dynamoose.Schema

module.exports = new Schema({
  name: {
    type: String,
    required: true,
  },
  categoryCode: {
    type: Number,
    required: true,
    hashKey: true,
    index: {
      global: true,
      name: 'categoryCode-index'
    }
  }
})