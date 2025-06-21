"use strict";

const { Schema, model } = require("mongoose");
const { PAYMENT, PAYMENT_STATUS, ORDER_STATUS } = require('../configs/contants')
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        image: String,
        size: String,
        quantity: Number,
        price: Number,
        discount: Number,
      },
    ],
    shipping: {
      address: { type: String, required: true },
      phone: { type: String, required: true },
      name: String,
    },
    payment: {
      method: { type: String, enum: [PAYMENT.COD, PAYMENT.VNPAY], required: true },
      status: {
        type: String,
        enum: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PAID, PAYMENT_STATUS.FAILDED, PAYMENT_STATUS.COMPLETED],
        default: "pending",
      },
    },
    checkout: {
        totalPrice: { type: Number, required: true },
        totalDiscount: { type: Number, default: 0 },
        totalCheckout: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPING, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
      default: ORDER_STATUS.PENDING,
    },
    trackingNumber: String,
    note: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, OrderSchema);
