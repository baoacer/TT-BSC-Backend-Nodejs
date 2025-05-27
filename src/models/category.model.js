const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, CategorySchema);
