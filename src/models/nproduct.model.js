const { Schema, model } = require('mongoose');
const { collection } = require('./discount.model');

const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

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


module.exports = model(DOCUMENT_NAME, ProductSchema);
