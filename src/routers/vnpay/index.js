const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const VnPayController = require('../../controllers/vnpay.controller')
const router = express.Router()

router.post('/create_payment_url', asyncHandler(VnPayController.createPaymentUrl))
router.get('/handle_payment_response', asyncHandler(VnPayController.handlePaymentResponse))

module.exports = router