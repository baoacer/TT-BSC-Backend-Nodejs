'use strict'
const Cart = require('../models/cart.model')
const CartRepository = require('./repositories/cart.repo')
const ProductRepository = require('./repositories/product.repo')
const { NotFoundError } = require('../core/error.response')
const Utils = require('../utils')
const { product } = require('../models/product.model')

/*
   - add product to cart [user]
   - reduce product quantity [user]
   - increase product quantity [user]
   - get cart [user]
   - delete cart [user]
   - delete item [user]
 */

const addToCart = async ({ userID, product = {} }) => {

    const { id: productID, quantity, size } = product

    // check exists 
    const userCart = await CartRepository.findCartByUserID({ userID })

    // check product exists
    const foundProduct = await ProductRepository.findProductSelect({
        productID,
        select: ['createdAt', 'updatedAt', '__v']
    })
    if(!foundProduct) throw new NotFoundError('Product Not Found')

    foundProduct.quantity = quantity
    foundProduct.size = size

    // cart not exits 
    // create
    if(!userCart){
        return CartRepository.createCart({ userID , product: foundProduct })
    }

    // cart exists 
    // 1. cart exists but not product 
    const isProductInCart = userCart.cart_products.findIndex(p => p._id.toString() === foundProduct._id.toString())
    if(isProductInCart === -1){
        userCart.cart_products.push(foundProduct)
        return await userCart.save()
    }

    // 2. cart exists and have product -> update quantity
    return await CartRepository.updateUserCartQuantity({ userID, product: foundProduct })
}

const deleteUserCartItem = async ({ userID, productID }) => {
    return await CartRepository.deleteUserCartItem({ userID, productID })
}

const getListUserCart = async ( userID ) => {
    return await CartRepository.findListUserCart({ userID })
}

module.exports = {
    addToCart,
    deleteUserCartItem,
    getListUserCart
}