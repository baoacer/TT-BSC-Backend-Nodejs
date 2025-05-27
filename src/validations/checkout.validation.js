'use strict'

const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const { ErrorResponse } = require('../core/error.response')

const review = async (req, res, next) => {
    const condition = Joi.object({ 
        cartID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).trim().strict()
        .messages({ 
                'string.pattern.base': 'Invalid cart ID format'
        })
    })

    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
} 

const order = async (req, res, next) => {
    const condition = Joi.object({
        cartID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).trim().strict()
        .messages({
            'string.pattern.base': 'Invalid cart ID format'
        }),
        userID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).trim().strict()
        .messages({
            'string.pattern.base': 'Invalid user ID format'
        }),
        payment: Joi.string().required().valid('VNPAY', 'COD').trim().strict()
    })

    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
} 

module.exports = {
    review,
    order
}