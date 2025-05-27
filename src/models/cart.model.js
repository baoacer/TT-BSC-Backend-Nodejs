"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const CartSchema = new Schema({
    cart_user_id: {type: Schema.Types.ObjectId, ref: "User"},
    cart_products: {type: Array, require: true, default: []},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, CartSchema);

