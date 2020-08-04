const StoreHelper = require('../../../Helper/StoreHelper')

module.exports = {
  CreateStoreInformation: async (req, res, next) => {
    let data = await StoreHelper.getCreateStoreInformaitionDto(req)
    let createStoreInformation = StoreHelper.createStoreInformation(data)
    createStoreInformation.then(result => res.status(201).send(result))
      .catch(err => res.status(503).send(err))
  },
  ReadAllStore: async (req, res, next) => {

  },
}