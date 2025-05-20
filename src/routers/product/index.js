
const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const ProductController = require('../../controllers/product.controller')
const AuthUtils = require('../../auth/auth.utils')
const router = express.Router()
    
router.get('/search', asyncHandler(ProductController.getListSearchProducts))
router.get('', asyncHandler(ProductController.getAllProducts))  
router.get('/:productId', asyncHandler(ProductController.getProduct))  
 
router.use(AuthUtils.authentication)

router.patch('/:productId', asyncHandler(ProductController.updateProduct))
router.post('', asyncHandler(ProductController.createProduct))
router.post('/publish/:productId', asyncHandler(ProductController.publishProductByShop))
router.post('/unPublish/:productId', asyncHandler(ProductController.unPublishProductByShop))

// query
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishsForShop))

module.exports = router