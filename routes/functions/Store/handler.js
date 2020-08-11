const StoreHelper = require('../../../Helper/StoreHelper')

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
  ReadStoreDetail: async (req, res, next) => {
    /**
     * URI: [GET, /api/store/:storeId]
     */
    let data = await StoreHelper.getStoreDetailDto(req)
    let readAllStore = StoreHelper.readStoreDetail(data)
    readAllStore
      .then(result => res.status(201).json(result))
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
    data = await StoreHelper.getSqlForReadOrderByType(data)
    let readAllStore = StoreHelper.readOrderByType(data)
    readAllStore
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
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
  CreateOpeningTime: async (req, res, next) => {
    /**
      * URI: [POST, /api/store/:storeId/time]
      * Request Body: {
      *   "sun": {
      *     "open": "09:00",
      *     "close": "20:00"
      *   },
      *   "mon": {
      *     "open": "09:00",
      *     "close": "20:00"
      *   },
      *   "tue": {
      *     "open": "09:00",
      *     "close": "20:00"
      *   },
      *   "wed": {
      *     "open": "09:00",
      *     "close": "20:00"
      *   },
      *   "thu": {
      *     "open": "09:00",
      *     "close": "20:00"
      *   },
      *   "fri": {
      *     "open": "09:00",
      *     "close": "20:00"
      *   },
      *   "sat": {
      *     "open": "09:00",
      *     "close": "20:00"
      *   },
      * }
      */
    let data = await StoreHelper.getCreateOpeningTimeDto(req)
    data = await StoreHelper.getSqlForCreateOpeningTIme(data)
    let createOpeningTime = StoreHelper.createOpeningTime(data)
    createOpeningTime
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  CreateStoreTelephone: async (req, res, next) => {
    /**
     * URI: [POST, /api/store/telephone]
     * Request Body: {
     *  "1": "...",
     *  "2": "..."
     * }
     */
    let data = await StoreHelper.getCreateTelephoneDto(req)
    data = await StoreHelper.getSqlForCreateTelephone(data)
    let createTelephone = StoreHelper.createTelephone(data)
    createTelephone
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  CreateVoteGrade: async (req, res, next) => {
    /**
     * URI: [POST, /api/store/:storeId/votegrade]
     * Request Body: {
     *  "kindess": ...,
     *  "merchandise": ...,
     *  "price": ... 
     * }
     */
    let data = await StoreHelper.getVoteGradeDto(req)
    let createVoteGrade = StoreHelper.createVoteGrade(data)
    createVoteGrade
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  EditVoteGrade: async (req, res, next) => {
    /**
     * URI: [PUT, /api/store/:storeId/votegrade]
     * Request Body: {
     *  "kindess": ...,
     *  "merchandise": ...,
     *  "price": ... 
     * }
     */
    let data = await StoreHelper.getVoteGradeDto(req)
    let editVoteGrade = StoreHelper.editVoteGrade(data)
    editVoteGrade
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  CreateStoreMerchandise: async (req, res, next) => { // 단위?, 가격? 
    /**
     * URI: [POST, /api/store/:storeId/merchandise]
     * Request Body: {
     *  "kindess": ...,
     *  "merchandise": ...,
     *  "price": ... 
     * }
     */
    let data = await StoreHelper.getCreateVoteGradeDto(req)
    let createVoteGrade = StoreHelper.createVoteGrade(data)
    createVoteGrade
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  CreateOrderType: async (req, res, next) => {
    /**
      * URI: [POST, /api/store/ordertype]
      * Request Body: {
      *   "1": "...",
      *   "2": "..."
      * }
      */
    let data = await StoreHelper.getCreateOrderTypeDto(req)
    data = await StoreHelper.getSqlForCreateOrderType(data)
    let createOderType = StoreHelper.createOrderType(data)
    createOderType
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
  RegisterOrderTypeOnStore: async (req, res,next)=> {
    /**
     * URI: [POST, /api/store/:storeId/ordertype]
     * Request Body: {
     *  "1": {
     *    "id": ...,
     *    "order_type": "..."
     *  },
     *  "2": {
     *    "id": ...,
     *    "order_type": "..."
     *  }
     * }
     */
    let data = await StoreHelper.getRegisterOrderTypeDto(req)
    data = await StoreHelper.getSqlForRegisterOrderType(data)
    let registerOrderType = StoreHelper.registerOrderTypeOnStore(data)
    registerOrderType
      .then(result => res.status(201).json(result))
      .catch(err => res.status(503).send(err))
  },
}