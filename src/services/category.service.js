'use strict'

const { NotFoundError } = require('../core/error.response')
const CategoryRepository = require('./repositories/category.repo')

const createCategory = async ({ name }) => {
    const isExists = await CategoryRepository.findByName({ name })
    if (isExists) {
        throw new NotFoundError('Category not found');
    }
    return await CategoryRepository.createCategory({ name })
}

const getAllCategories = async () => {
    return await CategoryRepository.findAll();
}

const updateCategory = async (id, { name }) => {
    return await CategoryRepository.updateById({ id, name });
}

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory
}