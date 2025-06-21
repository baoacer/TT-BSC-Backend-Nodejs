"use strict";
const ProductService = require("../services/product.service");
const { StatusCodes } = require("../utils/handler/http.status.code");

const createProduct = async (req, res, next) => {
  try {
    let images;
    if (req.file) {
      images = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
    const payload = images ? { ...req.body, images } : { ...req.body };
    const product = await ProductService.createProduct(payload);
    res.status(StatusCodes.CREATED).json({
      metadata: product,
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await ProductService.findProductByID(req.params);
    res.status(StatusCodes.OK).json({
      metadata: product,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const { pagination, products } = await ProductService.findAllProducts(
      req.query
    );
    res.status(StatusCodes.OK).json({
      metadata: products,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProductsByCategory = async (req, res, next) => {
  try {
    const { pagination, products } =
      await ProductService.findAllProductsByCategory(req.query);
    res.status(StatusCodes.OK).json({
      metadata: products,
      pagination: pagination,
    });
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { results, pagination } = await ProductService.searchProduct(
      req.query
    );
    res.status(StatusCodes.OK).json({
      metadata: results,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { productID } = req.query;
    return res.status(StatusCodes.OK).json({
      metadata: await ProductService.deleteProduct({ productID }),
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let images;
    if (req.file) {
      images = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
    const { productID } = req.params;
    const payload = images ? { ...req.body, images } : { ...req.body };
    const updated = await ProductService.updateProduct({ productID, payload });
    res.status(StatusCodes.OK).json({
      metadata: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  searchProducts,
  getAllProductsByCategory,
  deleteProduct,
  updateProduct,
};
