let dynamoose = require('dynamoose')
let Schema = dynamoose.Schema

module.exports = new Schema({
  id: {
    hashKey: true,
    type: String,
    required: true
  },
  categoryCode: {
    type: Number,
    required: true
  },
  regDate: {
    type: Date,
    require: true
  },
  kamisProductJSON: {
    type: [Object],
    required: true
  }
})