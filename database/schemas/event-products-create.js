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
    type: 'String',
    required: true
  },
  kamisProductJSON: {
    type: Array,
    schema: [{
      'type': Object,
      'schema': {
        id: { type: Number },
        item_name: { type: String },
        item_code: { type: String },
        kind_name: { type: String },
        kind_code: { type: String },
        rank: { type: String },
        rank_code: { type: String },
        unit: { type: String },
        day1: { type: String },
        dpr1: { type: String },
        day2: { type: String },
        dpr2: { type: String },
        day3: { type: String },
        dpr3: { type: String },
        day4: { type: String },
        dpr4: { type: String },
        day5: { type: String },
        dpr5: { type: String },
        day6: { type: String },
        dpr6: { type: String },
        day7: { type: String },
        dpr7: { type: String },
      }
    }]
  }
})