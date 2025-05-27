'use strict'
const CategoryService = require('../services/category.service')
const { StatusCodes } = require('http-status-codes')

const createNew = async (req, res, next) => {
    try {
        const { name } = req.body
        const category = await CategoryService.createCategory(name)
        return res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED,
            message: "Category created successfully",
            data: category
        })
    } catch (error) {
        next(error)
    }
}

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await CategoryService.getAllCategories()
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Get all categories successfully",
            data: categories
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
            status: StatusCodes.OK,
            message: "Get category successfully",
            data: category
        })
    } catch (error) {
        next(error)
    }
}

const updateCategoryByID = async (req, res, next) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const category = await CategoryService.updateCategory(id, name)
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Updated category successfully",
            data: category
        })
    } catch (error) {
        next(error)
    }
}

const deleteCategoryByID = async (req, res, next) => {
    try {
        const { id } = req.params
        const category = CategoryService.deleteCategory(id)
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: "Deleted category successfully",
            data: category
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createNew,
    getAllCategories,
    updateCategoryByID,
    deleteCategoryByID,
    getCategoryByID
}