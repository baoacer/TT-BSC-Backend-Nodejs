"use strict";

const { findById } = require("../../models/cart.model");
const { product } = require("../../models/product.model");
const Utils = require("../../utils/index");

class ProductRepository {
  static checkProductByServer = async (products) => {
    return await Promise.all(
      products.map(async (product) => {
        const foundProduct = await this.findProductById(product.product_id);
        if (foundProduct) {
          return {
            product_price: foundProduct.product_price,
            product_quantity: product.product_quantity,
            product_id: foundProduct._id,
          };
        }
      })
    );
  };

  static updateProductById = async ({
    productId,
    payload,
    model,
    isNew = true,
  }) => {
    const updateProduct = await model.findByIdAndUpdate(productId, payload, {
      new: isNew,
    });
    return updateProduct;
  };

  static findProductUnSelect = async ({ productId, unSelect }) => {
    return await product
      .findById(productId)
      .select(Utils.unGetSelectData(unSelect))
      .lean()
      .exec();
  };

  static findProductSelect = async ({ productId, select }) => {
    return await product
      .findById(productId)
      .select(Utils.getSelectData(select))
      .lean()
      .exec();
  };

  static findProductById = async (productId) => {
    return await product
      .findOne({ _id: Utils.convertObjectId(productId) })
      .lean();
  };

  static findAllProducts = async ({ filter, limit, page, sort, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await product
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(Utils.getSelectData(select))
      .lean()
      .exec();

    return products;
  };

  static searchProductByUser = async ({
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
      query.$or = [
        { product_name: { $regex: keyword, $options: "i" } },
        { product_description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.product_price = {};
      if (minPrice) query.product_price.$gte = parseFloat(minPrice);
      if (maxPrice) query.product_price.$lte = parseFloat(maxPrice);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = await product
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select(Utils.getSelectData(select))
      .lean();

    const total = await product.countDocuments(query);

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

  /**
   * @param {query} - query filter
   * @param {limit} - so luong ket qua tra ve
   * @param {skip} - so luong can bo qua truoc khi lay ket qua
   * @returns
   */
  static findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await this.queryProduct({ query, limit, skip });
  };

  // publish //
  static findAllPublishsForShop = async ({ query, limit, skip }) => {
    return await this.queryProduct({ query, limit, skip });
  };

  static unPublishProductByShop = async ({ shopId, productId }) => {
    const foundShop = await product.findOne({
      _id: productId,
      product_shop: shopId,
    });
    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
  };

  static publishProductByShop = async ({ shopId, productId }) => {
    const foundShop = await product.findOne({
      _id: productId,
      product_shop: shopId,
    });
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
  };

  static queryProduct = async ({ query, limit, skip }) => {
    return await product
      .find(query)
      .populate("product_shop", "name email -_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  };
}

module.exports = ProductRepository;
