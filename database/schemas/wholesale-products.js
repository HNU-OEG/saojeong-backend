let dynamoose = require('../dynamodb')
let Schema = dynamoose.Schema

module.exports = new Schema({
  date: {
    type: Date,
    rangeKey: true
  },
  categoryCode: {
    type: Number
  },
  // categoryCode: {
  //   type: Number,
  //   required: true
  // },
  itemCode: {
    type: Number,
    required: true,
    hashKey: true
  },
  itemName: {
    type: String,
    required: true
  },
  kindCode: {
    type: Number,
    required: true
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