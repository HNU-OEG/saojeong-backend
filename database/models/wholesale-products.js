const dynamoose = require('../dynamodb')
const schema = require('../schemas/wholesale-products')
const Product = dynamoose.model('wholesale-products', schema)

module.exports = {
  model: Product,
  format: (data) => {
    return {
      date: data.date,
      categoryCode: Number(data.item_code[0] + '00'),
      itemCode: Number(data.item_code),
      itemName: data.item_name,
      kindCode: data.kind_code,
      rankCode: data.rank_code,
      unit: data.unit,
      price: Number(data.prices.replace(/,/g, '')
    }
  }
}