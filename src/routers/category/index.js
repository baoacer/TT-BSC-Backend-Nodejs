const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()
const CategoryController = require('../../controllers/category.controller')
const validation = require('../../validations/category.validation')

router.route('/').post(validation.createNew, asyncHandler(CategoryController.createNew))
router.route('/:id').get(validation.params, asyncHandler(CategoryController.getCategoryByID))
router.route('/').get(asyncHandler(CategoryController.getAllCategories))
router.route('/:id').put(validation.update, asyncHandler(CategoryController.updateCategoryByID))
router.route('/:id').delete(validation.params, asyncHandler(CategoryController.deleteCategoryByID))

module.exports = router 