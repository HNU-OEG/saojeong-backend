const dynamoose = require('../dynamodb')
const schema = require('../schemas/category')
const Categories = dynamoose.model('category', schema)
const { Category } = require('../../config/product-attributes')

module.exports = {
  model: Categories,
  CreateCategory: async () => {
    let datas = []
    Object.keys(Category).forEach(key => {
      let data = {
        name: Category[key],
        categoryCode: Number(key)
      }
      datas.push(data)
    })
    console.log(datas)
    try {
      const newEvents = await Categories.batchPut(datas)
      return newEvents
    } catch (err) {
      console.log('err :>> ', err)
    }
  }
}