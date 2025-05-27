'use strict'

const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const { ErrorResponse } = require('../core/error.response')

const addToCart = async (req, res, next) => {
    const condition = Joi.object({
        userID: Joi.string().required().min(2).max(50).trim().strict(),
        product: Joi.object({
            id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).trim().strict()
            .messages({
                'string.pattern.base': 'Invalid product ID format'
            }),
            quantity: Joi.number().required().min(1).max(1000)
        }).required()
    })

    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
} 

const deleteProductToCard = async (req, res, next) => {
    const condition = Joi.object({
        userID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).trim().strict()
        .messages({
            'string.pattern.base': 'Invalid user ID format'
        }),
        productID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).trim().strict()
        .messages({
            'string.pattern.base': 'Invalid product ID format'
        }),
    })

    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
} 

const getListUserCart = async (req, res, next) => {
    const condition = Joi.object({
        userID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).trim().strict()
        .messages({
            'string.pattern.base': 'Invalid user ID format'
        })
    })

    try {
        await condition.validateAsync(req.query, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
}


module.exports = {
    addToCart,
    deleteProductToCard,
    getListUserCart
}