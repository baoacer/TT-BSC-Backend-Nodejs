'use strict'

const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const { ErrorResponse } = require('../core/error.response')

const createNew = async (req, res, next) => {
    const condition = Joi.object({
        name: Joi.string().required().min(2).max(50).trim().strict()
    })

    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
} 

const update = async (req, res, next) => {
    const conditionBody = Joi.object({
        name: Joi.string().required().min(2).max(50).trim().strict()
    })

    const conditionParams = Joi.object({
        id: Joi.string().required().trim().strict()
    })

    try {
        await conditionBody.validateAsync(req.body, { abortEarly: false })
        await conditionParams.validateAsync(req.params, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
} 

const params = async (req, res, next) => {
    const condition = Joi.object({
        id: Joi.string().required().trim().strict()
    })

    try {
        await condition.validateAsync(req.params, { abortEarly: false })
        next()
    } catch (error) {
        next(new ErrorResponse(new Error(error).message, StatusCodes.UNPROCESSABLE_ENTITY))
    }
} 

module.exports = {
    createNew,
    update,
    params
}