"use strict";

const { findById } = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Utils = require("../../utils/index");
const InventoryRepository = require("./inventory.repo");
const CategoryRepository = require("./category.repo");
const { NotFoundError } = require("../../core/error.response");

const createProduct = async ({
  name,
  images,
  price,
  discount,
  category,
  code,
  description,
}) => {
  return await Product.create({
    name,
    images,
    price,
    discount,
    category,
    code,
    description,
  });
};

const findProductByID = async ({ productID }) => {
  const product = await Product.findOne({ _id: productID }).lean();
  if (!product) return null;
  const inventory = await InventoryRepository.getInventoryByProductID({
    productID,
  });
  return { ...product, sizes: inventory };
};

const findByCode = async ({ code }) => {
  return await Product.findOne({ code }).lean();
};

const findProductUnSelect = async ({ productID, unSelect = [] }) => {
  return await Product.findOne({ _id: productID })
    .select(Utils.unGetSelectData(unSelect))
    .lean();
};

const findAllProducts = async ({ limit, page, sort = { createdAt: -1 } }) => {
  const skip = (page - 1) * limit;

  let [products, total] = await Promise.all([
    Product.find().sort(sort).skip(skip).limit(limit).lean().exec(),
    Product.countDocuments(),
  ]);

  products = await Promise.all(
    products.map(async (product) => {
      const inventory = await InventoryRepository.getInventoryByProductID({
        productID: product._id,
      });
      return {
        ...product,
        sizes: inventory,
      };
    })
  );

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const findAllProductsByCategory = async ({ limit, page, category }) => {
  const skip = (page - 1) * limit;
  let filter = {};
  if (category) {
    const categoryExists = await CategoryRepository.findByName({
      name: category,
    });
    if (!categoryExists) {
      throw new NotFoundError("Category not found");
    }
    filter = categoryExists ? { category: categoryExists._id } : {};
  }

  const products = await Product.find(filter)
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  const total = await Product.countDocuments(filter);

  const productsWithInventory = await Promise.all(
    products.map(async (product) => {
      const inventory = await InventoryRepository.getInventoryByProductID(
        product._id
      );
      return { ...product, sizes: inventory };
    })
  );
  return {
    products: productsWithInventory,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const searchProduct = async ({
  keyword = null,
  minPrice = null,
  maxPrice = null,
  sortOrder = "desc",
  sortBy = "createdAt",
  page = 1,
  limit = 20,
  select = [],
  category = null,
}) => {
  const match = {};

  if (keyword) {
    match.name = { $regex: keyword, $options: "i" };
  }

  if (category) {
    const categoryExists = await CategoryRepository.findByName({
      name: category,
    });
    if (categoryExists) {
      match.category = categoryExists._id;
    }
  }

  // Tạo pipeline
  const pipeline = [
    {
      $addFields: {
        finalPrice: {
          $subtract: ["$price", { $multiply: ["$price", "$discount"] }],
        },
      },
    },
    { $match: match },
  ];

  // Lọc theo giá đã giảm
  const priceFilter = {};
  if (minPrice) priceFilter.$gte = parseFloat(minPrice);
  if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
  if (Object.keys(priceFilter).length > 0) {
    pipeline.push({ $match: { finalPrice: priceFilter } });
  }

  // Sắp xếp
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortOptions });

  // Phân trang
  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: parseInt(limit) });

  // Chọn trường
  if (select && select.length > 0) {
    const project = {};
    select.forEach((field) => (project[field] = 1));
    project.finalPrice = 1;
    pipeline.push({ $project: project });
  }

  // Lấy kết quả và tổng số bản ghi
  const results = await Product.aggregate(pipeline);
  const totalPipeline = pipeline.filter(
    (stage) => !stage.$skip && !stage.$limit && !stage.$project && !stage.$sort
  );
  totalPipeline.push({ $count: "total" });
  const totalResult = await Product.aggregate(totalPipeline);
  const total = totalResult[0]?.total || 0;

  return {
    results,
    pagination: {
      total: total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPage: Math.ceil(total / parseInt(limit)),
    },
  };
};

const deleteProduct = async ({ productID }) => {
  return Product.deleteOne({ _id: Utils.convertObjectId(productID) });
};

const updateProductByID = async ({ productID, payload }) => {
  return await Product.findByIdAndUpdate(productID, payload, {
    new: true,
  }).lean();
};

module.exports = {
  findProductByID,
  findAllProducts,
  findAllProductsByCategory,
  createProduct,
  searchProduct,
  findByCode,
  findProductUnSelect,
  deleteProduct,
  updateProductByID,
};
