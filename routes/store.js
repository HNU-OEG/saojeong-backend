var express = require('express')
var router = express.Router()
const StoreHelper = require('../Helper/StoreHelper')
const StoreHandler = require('./functions/Store/handler.js')

router.get('/', StoreHandler.ReadAllStoreOrderByStar)
router.post('/', StoreHandler.CreateStoreInformation)
router.post('/:storeId/star', StoreHandler.RegisterStarredStore)
router.delete('/:storeId/star', StoreHandler.UnRegisterStarredStore)

router.post('/time', StoreHelper.CreateStoreOpeningTime)
router.post('/merchandise', StoreHelper.CreateStoreMerchandise)
router.post('/telephone', StoreHelper.CreateStoreTelePhone)
router.post('/:storeId/votegrade', StoreHelper.CreateVoteGrade)
router.put('/:storeId/votegrade', StoreHelper.UpdateVoteGrade)

router.post('/ordertype', StoreHelper.CreateOderType)

router.post('/:storeId/ordertype', StoreHelper.MappingOrderTypeToStore)

module.exports = router
