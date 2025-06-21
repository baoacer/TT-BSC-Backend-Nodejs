const CartService = require("../services/cart.service")
const { StatusCodes } = require("../utils/handler/http.status.code")

const addToCart = async ( req, res, next ) => {
    try {
        res.status(StatusCodes.OK).json({
            metadata: await CartService.addToCart(req.body)
        })
    } catch (error) {
        next(error)
    }   
} 

const deleteProductToCard = async ( req, res, next ) => {
    try {
        res.status(StatusCodes.OK).json({
            metadata: await CartService.deleteUserCartItem(req.body)
        })
    } catch (error) {
        next(error)
    }
}

const getListUserCart = async ( req, res, next ) => {
     try {
        const { userID } = req.query
        res.status(StatusCodes.OK).json({
            metadata: await CartService.getListUserCart(userID)
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addToCart,
    deleteProductToCard,
    getListUserCart
}