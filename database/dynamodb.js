const AWS = require('aws-sdk')
var dynamoose = require('dynamoose')

AWS.config.update({
  region: process.env.AWS_REGION_ENV_VAR
})

dynamoose.aws.sdk.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ENV_VAR,
  secretAccessKey: process.env.AWS_SECRET_KEY_ENV_VAR,
  region: process.env.AWS_REGION_ENV_VAR,
  maxRetries: 20,
})

dynamoose.model.defaults.set({
  create: true,
  prefix: process.env.DB_PREFIX,
  update: true,
  throughput: 'ON_DEMAND'
})

module.exports = dynamoose