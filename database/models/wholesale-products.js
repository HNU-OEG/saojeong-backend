const dynamoose = require('../dynamodb')
const schema = require('../schemas/wholesale-products')
const Product = dynamoose.model('wholesale-products', schema)

module.exports = {
  model: Product,
  create: (data) => {
    console.log('data :>> ', data)
    return new Product(data).save().then(result => {
      return result
    })
      .catch((err, result) => console.log(err, result))
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
      price: data.dpr1 == '-' ? 0 : Number(data.dpr1.replace(/,/g, ''))
    }
  }
}