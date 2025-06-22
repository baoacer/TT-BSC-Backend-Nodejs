"use strict";
const express = require("express");
const {authenticateJWT} = require("../middleware/auth.middleware");
const router = express.Router()

router.get('/api/checkstatus', (req, res) => {
    res.status(200).json({ 
        status: 200,
        message: "OK"
    })
})

router.use('/v1/api/user', require('./user/index'))
router.use('/v1/api/category', require('./category/index'))
router.use('/v1/api/chat', require('./chat/index'))
router.use('/v1/api/product', require('./product/index'))
router.use('/v1/api/vnpay', require('./vnpay/index'))
router.use('/v1/api/role', require('./role/index'))

router.use(authenticateJWT)

router.use('/v1/api/order', require('./order/index'))
router.use('/v1/api/cart', require('./cart/index'))
router.use('/v1/api/template', require('./template/index'))


module.exports = router