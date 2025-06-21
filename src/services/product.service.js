"use strict";
const ProductRepository = require("./repositories/product.repo");
const {
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");
const CategoryRepository = require("./repositories/category.repo");
const InventoryRepository = require("./repositories/inventory.repo");
const { getRedisClient } = require("../databases/init.redis");

const createProduct = async ({
  name,
  images,
  price,
  description,
  discount = 0,
  category,
  sizes = [],
  code,
}) => {
  /**
   * Get Instance Redis
   */
  const redisClient = await getRedisClient();

  /**
   * Check Code Exists
   */
  const existingCode = await ProductRepository.findByCode({ code });
  if (existingCode) {
    throw new ConflictRequestError("Product code already exists");
  }

  /**
   * Check Category
   */
  const categoryExists = await CategoryRepository.findByName({
    name: category,
  });
  if (!categoryExists) {
    throw new NotFoundError("Category not found");
  }

  /**
   * Create Product
   */
  const product = await ProductRepository.createProduct({
    name,
    images,
    price,
    discount,
    category: categoryExists._id,
    code,
    description,
  });

  /**
   * Create Inventory With Size
   */
  sizes = JSON.parse(sizes);
  if (Array.isArray(sizes)) {
    for (const size of sizes) {
      await InventoryRepository.createInventory({
        productID: product._id,
        size: size.size,
        stock: size.stock || 0,
      });
    }
  }

  /**
   * Get Size From Inventory By Product ID
   */
  const inventory = await InventoryRepository.getInventoryByProductID({
    productID: product._id,
  });

  /**
   * Del Key Redis
   */
  const keys = await redisClient.keys("products*");
  if (keys.length > 0) {
    await redisClient.del(keys);
  }

  return product;
};

const findProductByID = async ({ productID }) => {
  const redisClient = await getRedisClient();
  await redisClient.del(`product:${productID}`);
  const cacheKey = `product:${productID}`;
  let product = await redisClient.get(cacheKey);
  if (product) {
    return JSON.parse(product);
  }
  product = await ProductRepository.findProductByID({ productID });
  if (product) {
    await redisClient.set(cacheKey, JSON.stringify(product), { EX: 300 });
  }
  return product;
};

const findAllProducts = async ({ limit = 8, page = 1 }) => {
  const redisClient = await getRedisClient();
  const cacheKey = `products:all:limit=${limit}:page=${page}`;
  let productsRedis = await redisClient.get(cacheKey);
  if (productsRedis) {
    return JSON.parse(productsRedis);
  }
  const { pagination, products } = await ProductRepository.findAllProducts({
    limit,
    page,
  });
  await redisClient.set(cacheKey, JSON.stringify({ products, pagination }), {
    EX: 300,
  });
  return {
    pagination,
    products,
  };
};

const findAllProductsByCategory = async ({
  category = null,
  limit = 10,
  page = 1,
}) => {
  // const redisClient = await getRedisClient();
  // const cacheKey = `products:category:${category}:limit=${limit}:page=${page}`;
  // let productsRedis = await redisClient.get(cacheKey);
  // if (productsRedis) {
  //   return JSON.parse(productsRedis);
  // }
  const { products, pagination } =
    await ProductRepository.findAllProductsByCategory({
      category,
      limit,
      page,
    });
  // await redisClient.set(cacheKey, JSON.stringify({ products, pagination }), { EX: 300 });
  return { products, pagination };
};

const searchProduct = async ({
  keyword,
  minPrice,
  maxPrice,
  sortOrder,
  sortBy,
  page,
  limit,
  select,
  category,
}) => {
  const { results, pagination } = await ProductRepository.searchProduct({
    keyword,
    minPrice,
    maxPrice,
    sortOrder,
    sortBy,
    page,
    limit,
    select,
    category,
  });
  return {
    results,
    pagination,
  };
};

const deleteProduct = async ({ productID }) => {
  const redisClient = await getRedisClient();
  const keys = await redisClient.keys("products*");
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
  await InventoryRepository.deleteInventoryByProductID({ productID });
  return await ProductRepository.deleteProduct({ productID });
};

const updateProduct = async ({ productID, payload }) => {
  const redisClient = await getRedisClient();
  const keys = await redisClient.keys("products*");
  if (keys.length > 0) {
    await redisClient.del(keys);
  }

  const product = await ProductRepository.findProductByID({ productID });
  if (!product) throw new NotFoundError("Product not found");

  if (product.code != payload.code) {
    const existsCode = await ProductRepository.findByCode({
      code: payload.code,
    });
    if (existsCode) throw new ConflictRequestError("Code đã tồn tại");
  }

  let sizes = payload.sizes;
  if (typeof sizes === "string") {
    try {
      sizes = JSON.parse(sizes);
    } catch (e) {
      sizes = [];
    }
  }
  if (Array.isArray(sizes)) {
    for (const size of sizes) {
      await InventoryRepository.updateInventoryStock({
        productID: product._id,
        size: size.size,
        setStock: size.stock,
      });
    }
  }
  return await ProductRepository.updateProductByID({ productID, payload });
};

module.exports = {
  findProductByID,
  findAllProducts,
  createProduct,
  findAllProductsByCategory,
  searchProduct,
  deleteProduct,
  updateProduct,
};
