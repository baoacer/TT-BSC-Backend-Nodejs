'use strict'
const CategoryService = require('../services/category.service')
const { StatusCodes } = require('http-status-codes')

const createNew = async (req, res, next) => {
    try {
        const { name } = req.body
        const category = await CategoryService.createCategory({ name })
        return res.status(StatusCodes.CREATED).json({
            metadata: category
        })
    } catch (error) {
        next(error)
    }
}

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await CategoryService.getAllCategories()
        return res.status(StatusCodes.OK).json({
            metadata: categories
        })
    } catch (error) {
        next(error)
    }
}

const getCategoryByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const category = await CategoryService.getCategoryById(id)
        return res.status(StatusCodes.OK).json({
            metadata: category
        })
    } catch (error) {
        next(error)
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        const category = await CategoryService.updateCategory(id, req.body)
        return res.status(StatusCodes.OK).json({
            metadata: category
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createNew,
    getAllCategories,
    getCategoryByID,
    updateCategory
}