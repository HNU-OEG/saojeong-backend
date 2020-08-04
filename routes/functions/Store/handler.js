const StoreHelper = require('../../../Helper/StoreHelper')

module.exports = {
  CreateStoreInformation: async (req, res, next) => {
    /**
      * URI: [POST, /api/store]
      * Request Body: {
      *   "store_name": "...",
      *   "store_number": ...,
      *   "store_type": [과일, 채소, 수산],
      * }
      */
    let data = await StoreHelper.getCreateStoreInformaitionDto(req)
    let createStoreInformation = StoreHelper.createStoreInformation(data)
    createStoreInformation
      .then(result => res.status(201).send(result))
      .catch(err => res.status(503).send(err))
  },
  ReadAllStore: async (req, res, next) => {

  },
  RegisterStarredStore: async (req, res, next) => {
    /**
      * URI: [POST, /api/store/:storeId/star]
      */
    let data = await StoreHelper.getRegisterStarredStoreDto(req)
    let registerStar = StoreHelper.registerStarredStore(data)
    registerStar
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))

  },
  UnRegisterStarredStore: async (req, res, next) => {
    /**
      * URI: [DELETE, /api/store/:storeId/star]
      */
    let data = await StoreHelper.getUnRegisterStarredStoreDto(req)
    let unRegisterStar = StoreHelper.unRegisterStarredStore(data)
    unRegisterStar
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
}