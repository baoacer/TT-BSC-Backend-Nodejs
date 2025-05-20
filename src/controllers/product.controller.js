'use strict'
const ProductFactory = require('../services/product.service')
const { SuccessResponse } = require('../core/success.response')

class ProductController {

    /**
     * @desc Create Product
     * @param {String} type - type of product 
     * @param {Object} payload - product data
     * @returns {JSON} 
     */
    static createProduct = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Create Product Success!",
            metadata: await ProductFactory.createProduct({
                type: req.body.product_type,
                payload: {
                    ...req.body,
                    product_shop: req.key.shop 
                }
            })
        }).send(res)
    }

    // ============== put ================

    static updateProduct = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Update Product Success!",
            metadata: await ProductFactory.updateProduct( 
                req.params.productId, req.body.product_type, {
                ...req.body,
                product_shop: req.key.shop
            })
        }).send(res)
    }

    static unPublishProductByShop = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Publish Product Success!",
            metadata: await ProductFactory.unPublishProductByShop({
                shopId: req.key.shop,
                productId: req.params.productId
            })
        }).send(res)
    }

    static publishProductByShop = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Publish Product Success!",
            metadata: await ProductFactory.publishProductByShop({
                shopId: req.key.shop,
                productId: req.params.productId
            })
        }).send(res)
    }

    // =============== end put ================



    // =============== query ================

    static getProduct = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Get Product Success!",
            metadata: await ProductFactory.findProduct({
                productId: req.params.productId
            })
        }).send(res)
    } 

    static getAllProducts = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Get All Product Success!",
            metadata: await ProductFactory.findAllProducts( req.params )
        }).send(res)
    } 

    static getListSearchProducts = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Get List Product Search Success!",
            metadata: await ProductFactory.searchProducts( req.query )
        }).send(res)
    } 

    /**
     * @desc Get all publish for shop
     * @param {String} shopId 
     * @param {Number} limit 
     * @param {Number} skip
     * @returns {JSON} 
     */
    static getAllPublishsForShop = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Get List Publish Success!",
            metadata: await ProductFactory.findAllPublishsForShop({
                shopId: req.key.shop
            })
        }).send(res)
    } 

    /**
     * @desc Get all draft for shop
     * @param {String} shopId 
     * @param {Number} limit 
     * @param {Number} skip
     * @returns {JSON} 
     */
    static getAllDraftsForShop = async ( req, res, next ) => { 
        new SuccessResponse({
            message: "Get List Draft Success!",
            metadata: await ProductFactory.findAllDraftsForShop({
                shopId: req.key.shop
            })
        }).send(res)
    }    

    // =============== end query ================
}

module.exports = ProductController