"use strict";
const ProductRepository = require("./repositories/product.repo");
const { ConflictRequestError, NotFoundError } = require('../core/error.response')
const CategoryRepository = require("./repositories/category.repo");

const createProduct = async ({
  name, image, price, discount = 0, category, sizes = [], code, quantity
}) => {
  const existingCode = await ProductRepository.findByCode({ code })
  if(existingCode){
    throw new ConflictRequestError('Product code already exists');
  }

  const categoryExists = await CategoryRepository.findById(category);
  if (!categoryExists) {
    throw new NotFoundError('Category not found');
  }

  const product = await ProductRepository.createProduct({
    name, image, price, discount, category, sizes, code, quantity
  })

  return product;
}

const findProductByID = async ({ productID }) => {
  return await ProductRepository.findProductByID({ productID });
}

const findAllProducts = async ({
  limit = 10, page = 1
}) => {
  return await ProductRepository.findAllProducts({ limit, page })
}

const findAllProductsByCategory = async ({
  categoryID,
  limit = 10,
  page = 1
}) => {
  return await ProductRepository.findAllProductsByCategory({
    categoryID,
    limit,
    page
  })
}

const searchProduct = async ({
  keyword,
  minPrice,
  maxPrice,
  sortOrder,
  sortBy,
  page,
  limit,
  select = [],
}) => {
  return await ProductRepository.searchProduct({
    keyword,
    minPrice,
    maxPrice,
    sortOrder,
    sortBy,
    page,
    limit,
    select,
  });
}




module.exports = {
  findProductByID,
  findAllProducts,
  createProduct,
  findAllProductsByCategory,
  searchProduct
};
