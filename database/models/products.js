const dynamoose = require('../dynamodb')
const schema = require('../schemas/products')
const Product = dynamoose.model('products', schema)

module.exports = {
  model: Product
}