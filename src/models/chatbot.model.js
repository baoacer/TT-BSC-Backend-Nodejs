"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "ChatMessage";
const COLLECTION_NAME = "ChatMessages";

const InventorySchema = new Schema({
    chat_user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        require: true
    },
    isBot: {
        type: Number,
        enum: [0, 1],
        require: true
    },
    message: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, InventorySchema)


