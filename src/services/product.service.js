"use strict";
const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const Utils = require("../utils");
const InventoryRepository = require("./repositories/inventory.repo");
const ProductRepository = require("./repositories/product.repo");
const NotificationService = require("./notification.service");
const {
  ORDER_01,
  ORDER_02,
  PROMOTION_01,
  SHOP_01,
} = require("../utils/contants");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, productClass) {
    ProductFactory.productRegistry[type] = productClass;
  }

  // put //

  static async createProduct({ type, payload }) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type::${type}`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(productId, type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type::${type}`);
    return new productClass(payload).updateProduct(productId);
  }

  static async publishProductByShop({ shopId, productId }) {
    return await ProductRepository.publishProductByShop({ shopId, productId });
  }

  static async unPublishProductByShop({ shopId, productId }) {
    return await ProductRepository.unPublishProductByShop({
      shopId,
      productId,
    });
  }

  // query //

  static async findProduct({ productId }) {
    return await ProductRepository.findProduct({
      productId: productId,
      unSelect: ["__v", "isPublished", "isDraft", "createdAt", "updatedAt"],
    });
  }

  static async findAllProducts({
    filter = { isPublished: true },
    limit = 50,
    page = 1,
    sort = "ctime",
    select = {},
  }) {
    return await ProductRepository.findAllProducts({
      filter: filter,
      limit: limit,
      page: page,
      sort: sort,
      select: (select = [
        "product_name",
        "product_thumb",
        "product_price",
        "product_shop",
      ]),
    });
  }

  static async searchProducts({
    keyword,
    minPrice,
    maxPrice,
    sortOrder,
    sortBy,
    page,
    limit,
    select = [],
  }) {
    return await ProductRepository.searchProductByUser({
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

  static async findAllPublishsForShop({ shopId, limit = 50, skip = 0 }) {
    return await ProductRepository.findAllPublishsForShop({
      query: { product_shop: shopId, isPublished: true },
      limit: limit,
      skip: skip,
    });
  }

  static async findAllDraftsForShop({ shopId, limit = 50, skip = 0 }) {
    return await ProductRepository.findAllDraftsForShop({
      query: { product_shop: shopId, isDraft: true },
      limit: limit,
      skip: skip,
    });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await InventoryRepository.insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        quantity: this.product_quantity,
      });

      // push notification to system collection
      // microservice
      // promise -> not stop the process
      NotificationService.pushNotiToSystem({
        type: SHOP_01,
        senderId: this.product_shop,
        recieverId: 1,
        options: {
          product_name: this.product_name,
          shop_id: this.product_shop,
        },
      })
        .then((rs) => {
          console.log(rs);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return newProduct;
  }

  // update product
  async updateProduct(productId, payload) {
    return await ProductRepository.updateProductById({
      productId: productId,
      payload: payload,
      model: product,
    });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new clothing Error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new product Error");

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = Utils.removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await ProductRepository.updateProductById({
        productId,
        payload: Utils.updateNestedObjectParser(
          objectParams.product_attributes
        ),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      Utils.updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new electronic Error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new product Error");

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create new furniture Error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new product Error");

    return newProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
