let dynamoose = require('../dynamodb')
let Schema = dynamoose.Schema

module.exports = new Schema({
  id: {
    type: Number,
    required: true,
    hashKey: true
  },
  date: {
    type: Date,
    rangeKey: true
  },
  categoryCode: {
    type: Number
  },
  itemCode: {
    type: Number,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  kindName: {
    type: String
  },
  kindCode: {
    type: Number,
    required: true
  },
  rank: {
    type: String
  },
  rankCode: {
    type: Number
  },
  unit: {
    type: String
  },
  price: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
})