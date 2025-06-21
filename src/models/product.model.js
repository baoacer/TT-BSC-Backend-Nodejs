"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = `Product`;
const COLLECTION_NAME = `Products`;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  images: {
    url: { type: String },
    public_id: { type: String }
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, ProductSchema)
