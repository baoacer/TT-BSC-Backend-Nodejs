const CheckoutService = require('../services/checkout.service')
const { StatusCodes } = require('../utils/handler/http.status.code')

const checkoutReview = async ( req, res, next ) => {
    try {
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Checkout Review",
            data: await CheckoutService.checkoutReview(req.body)
        })
    } catch (error) {
        next(error)
    }
}

const orderByUser = async ( req, res, next ) => {
    try {
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "New Order By User",
            data: await CheckoutService.orderByUser(req.body)
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    checkoutReview,
    orderByUser
}