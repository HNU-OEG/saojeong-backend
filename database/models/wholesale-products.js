const dynamoose = require('../dynamodb')
const schema = require('../schemas/wholesale-products')
const Product = dynamoose.model('wholesale-products', schema)
const { getToday } = require('../../routes/functions/utils')
const SyncHelper = require('../../Helper/SyncHelper')
const { GenerateDate } = require('../../Helper/SyncHelper')

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
      id: data.id,
      date: data.date,
      categoryCode: Number(data.item_code[0] + '00'),
      itemCode: Number(data.item_code),
      itemName: data.item_name,
      kindCode: Number(data.kind_code),
      rankCode: Number(data.rank_code),
      kindName: data.kind_name,
      rank: data.rank,
      unit: data.unit,
      price: data.dpr1 == '-' ? 0 : Number(data.dpr1.replace(/,/g, ''))
    }
  },
  getPriceInfomationById: async (id) => {
    const product = await Product.query('id').eq(id).exec()
    return product
  },
  getPriceInfomationByIdAndTimestamp: async (id, timestamp) => {
    const product = await Product.query('id').eq(id).where('date').eq(timestamp).exec()
    return product
  },
  getLatestData: async (id, date = null) => {
    if (date != null) {
      date = GenerateDate(date, false)
      console.log(date)
    } else {
      date = GenerateDate(null, true)
    }
    const product = await Product.query('id').eq(id).where('date').eq(date).exec()
    return product
  }
}