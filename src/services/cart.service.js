'use strict'
const CartRepository = require('./repositories/cart.repo')
const ProductRepository = require('./repositories/product.repo')
const { NotFoundError } = require('../core/error.response')

const addToCart = async ({ userID, product = {} }) => {

    const { id: productID, quantity, size } = product

    // check exists 
    const userCart = await CartRepository.findCartByUserID({ userID })

    // check product exists
    const foundProduct = await ProductRepository.findProductUnSelect({
        productID,
        unSelect: ['createdAt', 'updatedAt', '__v']
    })
    if(!foundProduct) throw new NotFoundError('Product Not Found')

    foundProduct.quantity = quantity

    // Kiểm tra size có hợp lệ và xóa thuộc tính sizes khỏi foundProduct
    if (size) {
        if (!foundProduct.sizes || !foundProduct.sizes.includes(size)) {
            throw new NotFoundError('Size không tồn tại trong sản phẩm');
        }
        delete foundProduct.sizes;
        foundProduct.size = size;
    }

    // cart not exits 
    // create
    if(!userCart){
        return CartRepository.createCart({ userID , product: foundProduct })
    }

    // cart exists 
    // 1. cart exists but not product 
      const isProductInCart = userCart.cart_products.findIndex(
        p => p._id.toString() === foundProduct._id.toString() && p.size === foundProduct.size
    );
    if(isProductInCart === -1){
        userCart.cart_products.push(foundProduct)
        return await userCart.save()
    }

    // 2. cart exists and have product -> update quantity
    return await CartRepository.updateUserCartQuantity({ userID, product: foundProduct })
}

const deleteUserCartItem = async ({ userID, productID, size }) => {
    return await CartRepository.deleteUserCartItem({ userID, productID, size })
}

const getListUserCart = async ( userID ) => {
    return await CartRepository.findListUserCart({ userID })
}

module.exports = {
    addToCart,
    deleteUserCartItem,
    getListUserCart
}