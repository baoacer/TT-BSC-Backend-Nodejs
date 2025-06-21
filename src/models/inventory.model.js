"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const InventorySchema = new Schema({
    product_id: {type: Schema.Types.ObjectId, ref: "Product"},
    size: {type: String, required: true},
    stock: {type: Number, require: true, default: 0},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, InventorySchema)


