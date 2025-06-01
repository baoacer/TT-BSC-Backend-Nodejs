'use strict'
const Inventory = require('../../models/inventory.model')

const createInventory = async ({
    productID, stock, location = null
}) => {
    return await Inventory.create({
        inven_product_id: productID,
        inven_stock: stock,
        inven_location: location
    })
}

const findInventoryByProductID = async ({
    productID
}) => {
    return await Inventory.findOne({ inven_product_id: productID })
}

const updateInventoryStock = async ({ 
    productID, incStock = null, setStock = null
 }) => {
    const update = {};
    if (incStock !== null) {
        update.$inc = { inven_stock: incStock };
    }
    if (setStock !== null) {
        update.$set = { inven_stock: setStock };
    }
    if (Object.keys(update).length === 0) {
        throw new Error('No update operation specified');
    }
    return await Inventory.findOneAndUpdate(
        { inven_product_id: productID },
        update,
        { new: true }
    );
};

module.exports = {
    updateInventoryStock,
    createInventory,
    findInventoryByProductID
}