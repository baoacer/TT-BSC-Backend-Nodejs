"use strict";

const express = require("express")
const router = express.Router()
const CheckAuth = require("../auth/check.auth")
const { pushToLogDiscord } = require("../middlewares/index")

router.get('/checkstatus', (req, res) => {
    res.status(200).json({ 
        status: 200,
        message: "OK"
    })
})

router.use(pushToLogDiscord)
router.use(CheckAuth.apiKey)
// router.use(CheckAuth.permission("0"))

router.use('/v1/api/profile', require('./profile/index'))
router.use('/v1/api/rbac', require('./rbac/index'))
router.use('/v1/api/notification', require('./notifications/index'))
router.use('/v1/api/comment', require('./comment/index'))
router.use('/v1/api/inventory', require('./inventory/index'))
router.use('/v1/api/checkout', require('./checkout/index'))
router.use('/v1/api/cart', require('./cart/index'))
router.use('/v1/api/discount', require('./discount/index'))
router.use('/v1/api/product', require('./product/index'))
router.use('/v1/api/upload', require('./upload/index'))
router.use('/v1/api/shop', require('./access/index'))

module.exports = router