'use strict'
const VnPayService = require('../services/vnpay.service')
const { SuccessResponse } = require("../core/success.response")

class VnPayController {
    async createPaymentUrl(req, res, next) {
        return new SuccessResponse({
            message: 'Tạo link thanh toán thành công',
            metadata: await VnPayService.createPaymentUrl({
                ...req.body,
                ipAddr: req.ip
            })
        }).send(res)
    }

    async handlePaymentResponse(req, res, next) {
        return new SuccessResponse({
            message: 'Xử lý phản hồi thanh toán',
            metadata: await VnPayService.handlePaymentResponse(req.query)
        }).send(res)
    }
}

module.exports = new VnPayController()