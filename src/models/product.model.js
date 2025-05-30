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
  image: {
    type: String,
    required: true
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
  sizes: {
    type: [String],
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, ProductSchema)
