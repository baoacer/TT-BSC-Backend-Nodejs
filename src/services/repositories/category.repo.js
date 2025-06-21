'use strict'

const Category = require('../../models/category.model');

const findByName = async ({ name }) => {
    return await Category.findOne({ name });
}

const createCategory = async ({ name }) => {
    return await Category.create({ name });
}

const findAll = async () => {
    return await Category.find().sort({ createdAt: -1 });
}

const findById = async (id) => {
    return await Category.findById(id);
}

const updateById = async ({ id, name }) => {
    return await Category.findByIdAndUpdate(id, { name }, { new: true });
}

const deleteById = async ({ id }) => {
    return await Category.findByIdAndDelete(id);
}

module.exports = {
    findByName,
    createCategory,
    findAll,
    findById,
    updateById,
    deleteById
}
