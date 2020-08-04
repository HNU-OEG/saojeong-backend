const StoreHelper = require('../../../Helper/StoreHelper')
const { getSqlForReadOrderByType } = require('../../../Helper/StoreHelper')

module.exports = {
  CreateStoreInformation: async (req, res, next) => {
    /**
      * URI: [POST, /api/store]]
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
  ReadAllStoresOrderByGrade: async (req, res, next) => {
    /**
     * URI: [GET, /api/store]
     */
    let data = await StoreHelper.getAllReadOrderByGradeDto(req)
    let readAllStore = StoreHelper.readAllOrderByGrade(data)
    readAllStore
      .then(result => res.status(201).json(result[0]))
      .catch(err => res.status(503).send(err))
  },
  ReadStoresOrderByType: async (req, res, next) => {
    /**
     * URI: [GET, /api/store/type/:type/orderby/:orderby]
     * type: fruits, vegetables, seafoods
     * orderby: vote, name
     */
    let data = await StoreHelper.getReadOrderByTypeDto(req)
    data = await getSqlForReadOrderByType(data)
    let readAllStore = StoreHelper.readOrderByType(data)
    console.log(readAllStore)
    readAllStore
      .then(result => res.status(201).json(result[0]))
      .catch(err => res.status(503).send(err))
  },
  RegisterStarredStore: async (req, res, next) => {
    /**
      * URI: [POST, /api/store/:storeId/star]
      */
    let data = await StoreHelper.getRegisterStarredStoreDto(req)
    let sql = await StoreHelper.getSql(data)
    let registerStar = StoreHelper.registerStarredStore(sql)
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