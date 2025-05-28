const CartRepository = require('./repositories/cart.repo')
const { NotFoundError, BadRequestError } = require('../core/error.response')
const ProductRepository = require('./repositories/product.repo')
const OrderRepository = require('./repositories/order.repo')
const UserRepository = require('./repositories/user.repo')
const { PAYMENT } = require('../configs/contants')
const VnPayService = require('./vnpay.service')

const checkoutReview = async ({ cartID }) => {
    // check cart exists
    const foundCart = await CartRepository.findCartById({ cartID: cartID })
    if(!foundCart) throw new NotFoundError('Cart Not Found')

    const checkoutOrder = {
        totalPrice: 0,
        totalDiscount: 0,
        totalCheckout: 0
    }
    cartProducts = foundCart.cart_products

    for (let i = 0; i < cartProducts.length; i++) {
        const { _id: productID, quantity  } = cartProducts[i]  
        
        const checkProductServer = await ProductRepository.findProductByID({ productID })
        if(!checkProductServer) throw new BadRequestError('Order Wrong')

        const { price, discount } = checkProductServer
        
        // Tinh tong tien cua tung san pham
        const checkoutPrice = price * quantity

        // Tong tien truoc khi ap dung discount
        checkoutOrder.totalPrice += checkoutPrice

        // if have discount 
        if(discount > 0){
            checkoutOrder.totalDiscount += price * discount
        }
    }

    checkoutOrder.totalCheckout = checkoutOrder.totalPrice - checkoutOrder.totalDiscount

    return {
        totalPrice: checkoutOrder.totalPrice,
        totalDiscount: checkoutOrder.totalDiscount,
        totalCheckout: checkoutOrder.totalCheckout,
    }
}

const orderByUser = async ({
    cartID, userID, payment
}) => {
    const { totalPrice, totalDiscount, totalCheckout } = await checkoutReview({ cartID })
    const user = await UserRepository.findUserByID({ userID })
    const { cart_products } = await CartRepository.findCartById({ cartID })
    if(!user) throw new NotFoundError('Wrong order')

    const newOrder = OrderRepository.createOrder({
        order_user_id: user._id,
        order_checkout: totalCheckout,
        order_shipping: user.address,
        order_payment: payment,
        order_products: cart_products,
    })

    if(payment !== PAYMENT.VNPAY && newOrder){
        await CartRepository.clearUserCart({ userID })
    }

    if(payment == PAYMENT.VNPAY){
        return VnPayService.createPaymentUrl({
            orderAmount: (await newOrder).order_checkout,
            orderType: payment,
            orderId: (await newOrder)._id
        })
    }

    return newOrder
}

// query order [User]
const getAllOrderByUser = async ({ userID }) => {
    return await OrderRepository.getAllOrderByUserID({ userID });
}

// get one order [User]
const getOneOrderByUser = async () => {
}

// cancel order [User]
const cancelOrderByUser = async () => {

}

// update order [Shop | Admin]
const updateOrderStatusByShop = async () => {

}

module.exports = {
    getAllOrderByUser,
    checkoutReview,
    orderByUser
}