const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()
const CategoryController = require('../../controllers/category.controller')
const validation = require('../../validations/category.validation')
const { authenticateJWT, requireRole } = require('../../middleware/auth.middleware')


router.get('/', asyncHandler(CategoryController.getAllCategories))

router.use(authenticateJWT, requireRole('Admin'))
router.post('/', validation.create, asyncHandler(CategoryController.createNew))
router.put('/:id', validation.create, asyncHandler(CategoryController.updateCategory))

module.exports = router 