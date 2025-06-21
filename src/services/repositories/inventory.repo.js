'use strict'
const Inventory = require('../../models/inventory.model')

const createInventory = async ({
    productID, size, stock
}) => {
    return await Inventory.create({
        product_id: productID,
        size,
        stock
    })
}

const getInventoryByProductID = async ({
    productID
}) => {
    return await Inventory.find({ product_id: productID })
    .select('size stock -_id')
    .lean();
}

const updateInventoryStock = async ({ 
    productID, size, incStock = null, setStock = null
 }) => {
    const update = {};
    if (incStock !== null) {
        update.$inc = { stock: incStock };
    }
    if (setStock !== null) {
        update.$set = { stock: setStock };
    }
    if (Object.keys(update).length === 0) {
        throw new Error('No update operation specified');
    }

    const newInven = await Inventory.findOneAndUpdate(
        { product_id: productID, size: size },
        update,
        { new: true }
    );

    return newInven
};

const deleteInventoryByProductID = async ({ productID }) => {
  return await Inventory.deleteMany({ product_id: productID });
};

module.exports = {
    updateInventoryStock,
    createInventory,
    getInventoryByProductID,
    deleteInventoryByProductID
}