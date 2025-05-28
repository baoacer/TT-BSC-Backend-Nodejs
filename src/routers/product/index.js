
const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const ProductController = require('../../controllers/product.controller')
const router = express.Router()
const validation = require('../../validations/product.validation')
    
router.post('', validation.createNew ,asyncHandler(ProductController.createProduct))
router.get('/search', asyncHandler(ProductController.getListSearchProducts))
router.get('', asyncHandler(ProductController.getAllProducts))  
router.get('/category/:categoryID', asyncHandler(ProductController.getAllProductsByCategory))  
router.get('/:productID', asyncHandler(ProductController.getProduct))  
router.delete('/delete', asyncHandler(ProductController.deleteProduct))  

// router.patch('/:productId', asyncHandler(ProductController.updateProduct))
// router.post('', asyncHandler(ProductController.createProduct))
// router.post('/publish/:productId', asyncHandler(ProductController.publishProductByShop))
// router.post('/unPublish/:productId', asyncHandler(ProductController.unPublishProductByShop))

// // query
// router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
// router.get('/published/all', asyncHandler(ProductController.getAllPublishsForShop))

module.exports = router