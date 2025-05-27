const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const CartController = require('../../controllers/cart.controller')
const router = express.Router()
const validation = require('../../validations/cart.validation')

router.post('', validation.addToCart, asyncHandler(CartController.addToCart))
router.delete('', validation.deleteProductToCard, asyncHandler(CartController.deleteProductToCard))
router.get('', validation.getListUserCart, asyncHandler(CartController.getListUserCart))

module.exports = router