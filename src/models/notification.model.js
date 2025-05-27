"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";
const { ORDER_01, ORDER_02, PROMOTION_01, SHOP_01 } = require('../configs/contants');
// ORDER-01: order success
// ORDER-02: order failed
// PROMOTION-01: new promotion
// SHOP-01: new product by User following

const notificationSchema = new Schema({
    noti_type: {type: String, enum:[ORDER_01, ORDER_02, PROMOTION_01, SHOP_01], required: true},
    noti_senderId: {type: Schema.Types.ObjectId, required: true, ref: 'Shop'},
    noti_receiverId: {type: Number, required: true},
    noti_content: {type: String, required: true},
    noti_options: {type: Object, default: {}}, // for more information
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = {
    NOTI: model(DOCUMENT_NAME, notificationSchema)
}

