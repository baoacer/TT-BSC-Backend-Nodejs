'use strict'
const ProductService = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')
const { StatusCodes } = require('../utils/handler/http.status.code')

const createProduct = async ( req, res, next ) => { 
    try {
        const product = await ProductService.createProduct(req.body)
        res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED,
            message: 'Create Product Success!',
            data: product
        })
    } catch (error) {
        next(error)
    }
}

// ============== put ================

// const updateProduct = async ( req, res, next ) => { 
//     new SuccessResponse({
//         message: "Update Product Success!",
//         metadata: await ProductFactory.updateProduct( 
//             req.params.productId, req.body.product_type, {
//             ...req.body,
//             product_shop: req.key.shop
//         })
//     }).send(res)
// }




// =============== query ================

const getProduct = async ( req, res, next ) => { 
    try {
        const product = await ProductService.findProductByID(req.params)
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Get Product Success!",
            data: product
        })
    } catch (error) {
        next(error)
    }
    
} 

const getAllProducts = async ( req, res, next ) => { 
    try {
        const products = await ProductService.findAllProducts(req.query)
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Get All Product Success!",
            data: products
        })
    } catch (error) {
        next(error)
    }
} 

const getAllProductsByCategory = async ( req, res, next ) => { 
    try {
        const { categoryID } = req.params
        const products = await ProductService.findAllProductsByCategory({
            ...req.query,
            categoryID
        })
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Get All Product By Category Success!",
            data: products
        })
    } catch (error) {
        next(error)
    }
} 

const getListSearchProducts = async ( req, res, next ) => { 
    try {
        const products = await ProductService.searchProduct(req.query)
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Search Product Success!",
            data: products
        })
    } catch (error) {
        next(error)
    }
} 


module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    getListSearchProducts,
    getAllProductsByCategory
}