'use strict'

const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const { ErrorResponse } = require('../core/error.response')

const signUp = async (req, res, next) => {
    const condition = Joi.object({
        name: Joi.string().required().min(2).max(50).trim().strict()
        .messages({
            'string.base': 'Name must be a string',
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name must be at most 50 characters',
        }),
        email: Joi.string().required().email({ tlds: { allow: false }}).trim().strict()
        .messages({
            'string.email': 'Email must be a valid email address',
            'string.empty': 'Email is required',
        }),
        phone: Joi.string().required().pattern(/^[0-9+\-\s()]{7,15}$/).trim().strict()
        .messages({
            'string.pattern.base': 'Phone number is invalid',
            'string.empty': 'Phone number is required',
        }),
        address: Joi.string().required().min(2).max(100).trim().strict()
        .messages({
            'string.empty': 'Address is required',
            'string.min': 'Address must be at least 2 characters',
            'string.max': 'Address must be at most 100 characters',
        }),
        password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$')).trim().strict()
        .messages({
        'string.pattern.base': 'Password must include uppercase, lowercase, number and special character',
        })
    })

    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
} 

const login = async (req, res, next) => {
    const condition = Joi.object({
        email: Joi.string().required().email({ tlds: { allow: false }}).trim().strict()
        .messages({
            'string.email': 'Email must be a valid email address',
            'string.empty': 'Email is required',
        }),
        password: Joi.string().required().min(6).max(50).trim().strict()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'string.max': 'Password must be at most 50 characters',
        })
    })

    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
}

module.exports = {
    signUp,
    login
}