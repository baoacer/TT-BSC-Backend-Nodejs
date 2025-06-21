const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const ProductController = require('../../controllers/product.controller')
const router = express.Router()
const {authenticateJWT, requireRole} = require('../../middleware/auth.middleware')
const upload = require('../../configs/multer.config')

router.get('/search', asyncHandler(ProductController.searchProducts))
router.get('', asyncHandler(ProductController.getAllProducts))  
router.get('/category', asyncHandler(ProductController.getAllProductsByCategory))  
router.get('/:productID', asyncHandler(ProductController.getProduct))  

router.use(authenticateJWT, requireRole('Admin'))

router.post('', upload.single('image'), asyncHandler(ProductController.createProduct))
router.delete('/delete', asyncHandler(ProductController.deleteProduct)) 
router.patch('/:productID', upload.single('image'), asyncHandler(ProductController.updateProduct))


module.exports = router