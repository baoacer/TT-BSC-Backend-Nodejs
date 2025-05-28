"use strict";

const { findById } = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Utils = require("../../utils/index");

  // static checkProductByServer = async (products) => {
  //   return await Promise.all(
  //     products.map(async (product) => {
  //       const foundProduct = await this.findProductById(product.id);
  //       if (foundProduct) {
  //         return {
  //           product_price: foundProduct.product_price,
  //           product_quantity: product.product_quantity,
  //           product_id: foundProduct._id,
  //         };
  //       }
  //     })
  //   );
  // };

  // static updateProductById = async ({
  //   productId,
  //   payload,
  //   model,
  //   isNew = true,
  // }) => {
  //   const updateProduct = await model.findByIdAndUpdate(productId, payload, {
  //     new: isNew,
  //   });
  //   return updateProduct;
  // };

  // static findProductUnSelect = async ({ productId, unSelect }) => {
  //   return await product
  //     .findById(productId)
  //     .select(Utils.unGetSelectData(unSelect))
  //     .lean()
  //     .exec();
  // };

  // static findProductSelect = async ({ productId, select }) => {
  //   return await product
  //     .findById(productId)
  //     .select(Utils.getSelectData(select))
  //     .lean()
  //     .exec();
  // };

const createProduct = async ({
  name, image, price, discount, category, sizes, code, quantity
}) => {
  return await Product.create({
    name,
    image,
    price,
    discount,
    category,
    sizes,
    code,
    quantity
  })
}

const findProductByID = async ({
  productID
}) => {
  return await Product
    .findOne({ _id: productID })
    .lean();
};

const findByCode = async ({
  code
}) => {
  return await Product
    .findOne({ code })
    .lean();
};

const findProductSelect = async ({
  productID, select = []
}) => {
  return await Product
    .findOne({ _id: productID })
    .select(Utils.getSelectData(select))
    .lean();
};

const findAllProducts = async ({ limit, page}) => {
  const skip = (page - 1) * limit;
  const products = await Product
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return products;
};

const findAllProductsByCategory = async ({ limit, page, categoryID }) => {
  const skip = (page - 1) * limit;
  const filter = categoryID ? { category: categoryID } : {}
  const products = await Product
    .find(filter)
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return products;
};

const searchProduct = async ({
  keyword,
  minPrice,
  maxPrice,
  sortOrder = "desc",
  sortBy = 'createdAt',
  page,
  limit,
  select = []
}) => {
  const query = {};
  
  if (keyword) {
    const keywords = keyword.trim().split(/\s+/);
    query.$or = keywords.map(kw => ({
      name: { $regex: kw, $options: "i" },
    }));
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const results = await Product
    .find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .select(Utils.getSelectData(select))
    .lean();

  const total = await Product.countDocuments(query);

  return {
      data: results,
      pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPage: Math.ceil(total / parseInt(limit))
      }
  };
};

const deleteProduct = async ({ productID }) => {
  return Product.deleteOne({ _id: productID }).lean()
}

  
module.exports = {
  findProductByID,
  findAllProducts,
  findAllProductsByCategory,
  createProduct,
  searchProduct,
  findByCode,
  findProductSelect,
  deleteProduct
};
