'use strict'

const { NotFoundError } = require('../core/error.response')
const Category = require('../models/category.model')
const CategoryRepository = require('./repositories/category.repo')


const createCategory = async (name) => {
    const existing = await CategoryRepository.findByName(name)
    if (existing) {
        throw new NotFoundError('Category not found');
    }
    return await CategoryRepository.create(name)
}

const getAllCategories = async () => {
    return await CategoryRepository.findAll();
}

// Get a category by ID
const getCategoryById = async (id) => {
    const category = await CategoryRepository.findById(id);
    if (!category) {
        throw new NotFoundError('Category not found');
    }
    return category;
}

// Update a category
const updateCategory = async (id, name) => {
    const existing = await CategoryRepository.findById(id);
     if (!existing) {
        throw new NotFoundError('Category not found');
    }
    const category = await CategoryRepository.updateById(id, name);
   
    return category;
}

// Delete a category
const deleteCategory = async (id) => {
    const existing = await CategoryRepository.findById(id);
    if (!existing) {
        throw new NotFoundError('Category not exists');
    }
    const category = await Category.findByIdAndDelete(id);
    return category;
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}