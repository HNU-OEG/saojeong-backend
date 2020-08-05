var express = require('express')
var router = express.Router()
const StoreHelper = require('../Helper/StoreHelper')
const StoreHandler = require('./functions/Store/handler.js')

router.get('/', StoreHandler.ReadAllStoresOrderByGrade)
router.get('/type/:type/orderby/:orderby', StoreHandler.ReadStoresOrderByType)
router.post('/', StoreHandler.CreateStoreInformation)
router.post('/:storeId/star', StoreHandler.RegisterStarredStore)
router.delete('/:storeId/star', StoreHandler.UnRegisterStarredStore)
router.post('/:storeId/time', StoreHandler.CreateOpeningTime)
router.post('/:storeId/telephone', StoreHandler.CreateStoreTelephone)
router.post('/:storeId/votegrade', StoreHandler.CreateVoteGrade)


router.post('/merchandise', StoreHelper.CreateStoreMerchandise)
router.put('/:storeId/votegrade', StoreHelper.UpdateVoteGrade)

router.post('/ordertype', StoreHelper.CreateOderType)

router.post('/:storeId/ordertype', StoreHelper.MappingOrderTypeToStore)

module.exports = router
