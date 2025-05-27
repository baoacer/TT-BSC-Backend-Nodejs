"use strict";

const express = require("express")
const router = express.Router()

router.get('/api/checkstatus', (req, res) => {
    res.status(200).json({ 
        status: 200,
        message: "OK"
    })
})

router.use('/v1/api/vnpay', require('./vnpay/index'))
router.use('/v1/api/user', require('./user/index'))
router.use('/v1/api/category', require('./category/index'))
router.use('/v1/api/chat', require('./chat/index'))
router.use('/v1/api/checkout', require('./checkout/index'))
router.use('/v1/api/cart', require('./cart/index'))
router.use('/v1/api/product', require('./product/index'))

module.exports = router