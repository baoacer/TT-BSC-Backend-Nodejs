const cron = require('node-cron')
const OrderModel = require('../models/order.model')

cron.schedule('*/15 * * * *', async () => {
    const cutoffTime = new Date(Date.now() - 15 * 60 * 1000)
    const expiredOrders = await OrderModel.find({
        'payment.method': 'vnpay',
        'payment.status': 'pending',
        createdAt: { $lt: cutoffTime },
    });

    for(const order of expiredOrders){
        await OrderModel.deleteOne({ _id: order._id })
    }

    console.log(`[CRON] Xóa ${expiredOrders.length} đơn hàng VNPAY pending đã hết hạn.`);
})