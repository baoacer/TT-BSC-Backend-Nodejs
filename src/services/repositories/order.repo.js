const Order = require('../../models/order.model')


const createOrder = async (payload) => {
    const { order_user_id, order_checkout, order_shipping, order_payment, order_products } = payload
    return await Order.create({
        order_user_id: order_user_id,
        order_checkout: order_checkout,
        order_shipping: order_shipping,
        order_payment: order_payment,
        order_products: order_products,
    })
}

const findOrderById = async ({ orderID }) => {
    return await Order.findOne({ _id: orderID }).lean()
}
    


module.exports = {
    createOrder,
    findOrderById
}