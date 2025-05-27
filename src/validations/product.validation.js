'use strict'

const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const { ErrorResponse } = require('../core/error.response')

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        name: Joi.string()
            .required()
            .min(2)
            .max(100)
            .trim()
            .strict(),

        image: Joi.string()
            .uri()
            .required(),

        price: Joi.number()
            .required()
            .min(0),

        discount: Joi.number()
            .min(0)
            .max(1)
            .default(0),

        category: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid category ID format'
            }),

        sizes: Joi.array()
            .min(1)
            .required(),

        code: Joi.string()
            .alphanum()
            .required()
            .trim()
            .strict(),

        quantity: Joi.number()
            .integer()
            .min(0)
            .required()
    });

    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
} 


module.exports = {
    createNew,
}