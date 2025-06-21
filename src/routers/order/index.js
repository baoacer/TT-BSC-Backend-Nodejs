const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()
const CheckoutController = require('../../controllers/order.controller')
const validation = require('../../validations/checkout.validation')
const { requireRole } = require('../../middleware/auth.middleware')


router.post('/review', requireRole('User'), validation.review, asyncHandler(CheckoutController.checkoutReview))

router.post('/cancel', requireRole('User'), asyncHandler(CheckoutController.cancelOrderByUser))

// TODO: validation.order
router.post('', requireRole('User'), asyncHandler(CheckoutController.orderByUser))

router.get('/:userID', requireRole('User'), asyncHandler(CheckoutController.getAllOrderByUser))

router.post('/status/:orderID', requireRole('Admin'), asyncHandler(CheckoutController.updateOrderStatus))

router.get('', requireRole('Admin'), asyncHandler(CheckoutController.getOrdersByAdmin))

module.exports = router