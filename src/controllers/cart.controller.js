const CartService = require("../services/cart.service")
const { StatusCodes } = require("../utils/handler/http.status.code")

const addToCart = async ( req, res, next ) => {
    try {
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Add Product To Cart Success",
            data: await CartService.addToCart(req.body)
        })
    } catch (error) {
        next(error)
    }
} 

const deleteProductToCard = async ( req, res, next ) => {
    try {
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Delete Cart Item Success!",
            data: await CartService.deleteUserCartItem(req.body)
        })
    } catch (error) {
        next(error)
    }
}

const getListUserCart = async ( req, res, next ) => {
     try {
        const { userID } = req.query
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Get List Card Success!",
            data: await CartService.getListUserCart(userID)
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