'use strict'
const VnPayService = require('../services/vnpay.service')
const { StatusCodes } = require('../utils/handler/http.status.code')
const OrderRepository = require('../services/repositories/order.repo')
const CartRepository = require('../services/repositories/cart.repo')
const { PAYMENT_STATUS } = require('../configs/contants')

class VnPayController {
    async createPaymentUrl(req, res, next) {
        try {
            return res.status(StatusCodes.OK).json({
                metadata: await VnPayService.createPaymentUrl(req.body)
            })
        } catch (error) {
            next(error)
        }
    }

    async handlePaymentResponse(req, res, next) {
        try {
            const result = VnPayService.handlePaymentResponse(req.query)
            if(result.data && result.data.vnp_ResponseCode === '00'){
                const orderID = result.data.vnp_TxnRef;
                const order = await OrderRepository.findOrderById({ orderID });
                await OrderRepository.updatePaymentStatus({ orderID, status: PAYMENT_STATUS.PAID })
                if (order) {
                    await CartRepository.clearUserCart({ userID: order.user });
                }
            }
            const feUrl = `http://localhost:5173/payment-result`
                    + `?vnp_TransactionStatus=${result.data.vnp_TransactionStatus}`
                    + `&vnp_TxnRef=${result.data.vnp_TxnRef}`
                    + `&vnp_Amount=${result.data.vnp_Amount}`;
            return res.redirect(feUrl);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new VnPayController()