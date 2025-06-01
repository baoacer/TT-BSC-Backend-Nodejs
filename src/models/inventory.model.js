"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const InventorySchema = new Schema({
    inven_product_id: {type: Schema.Types.ObjectId, ref: "Product"},
    inven_location: {type: String, default: 'unknown'},
    inven_stock: {type: Number, required: true},
    inven_reservations: {type: Array, default: []},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, InventorySchema)


