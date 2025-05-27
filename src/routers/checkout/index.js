const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()
const CheckoutController = require('../../controllers/checkout.controller')
const validation = require('../../validations/checkout.validation')

router.post('/review', validation.review, asyncHandler(CheckoutController.checkoutReview))
router.post('/order', validation.order, asyncHandler(CheckoutController.orderByUser))

module.exports = router