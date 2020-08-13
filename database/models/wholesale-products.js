const dynamoose = require('../dynamodb')
const schema = require('../schemas/wholesale-products')
const Product = dynamoose.model('wholesale-products', schema)

module.exports = {
  model: Product,
  create: async (data) => {
    return new Product(data).save().then(result => {
      console.log(result)
      return result
    })
      .err(err => console.log(err))
  },
  format: (data) => {
    return {
      date: data.date,
      categoryCode: Number(data.item_code[0] + '00'),
      itemCode: Number(data.item_code),
      itemName: data.item_name,
      kindCode: Number(data.kind_code),
      rankCode: Number(data.rank_code),
      unit: data.unit,
      price: Number(data.dpr1.replace(/,/g, ''))
    }
  }
}