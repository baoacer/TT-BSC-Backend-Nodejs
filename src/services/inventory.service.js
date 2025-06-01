'use strict'
const InventoryRepository = require('./repositories/inventory.repo')
const { NotFoundError, BadRequestError } = require('../../core/error.response')
const Inventory = require('../../models/inventory.model')
const ProductRepository = require('./product.repo')

const addStockOnProductCreation = async ({
    productID, stock, location = null
}) => {
    const existProduct = await ProductRepository.findProductByID({ productID })
    if(!existProduct) throw new NotFoundError('Product Not Exist!')
    
    return await InventoryRepository.createInventory({
        productID, stock, location
    })
}

const deductStockOnOrder = async ({
    productID, quantity
}) => {
    if(quantity <= 0){
        throw new BadRequestError('Invalid quantity')
    }
    const inventory = await InventoryRepository.findInventoryByProductID({ productID });
    if(!inventory) throw new NotFoundError('Inventory Not Exist!')

    if(inventory.inven_stock < quantity){
        return false
    }

    await InventoryRepository.updateInventoryStock({
        productID,
        incStock: -quantity
    });
    return true
}

const increaseInventoryStock = async ({ 
    productID, quantity
}) => {
    if (quantity <= 0) throw new BadRequestError('Quantity must be greater than 0');
    const inventory = await InventoryRepository.findInventoryByProductID({ productID })
    if(!inventory) throw new NotFoundError('Inventory Not Found')
    return await InventoryRepository.updateInventoryStock({ productID, incStock: quantity })
}


const decreaseInventoryStock = async ({
    productID, quantity
}) => {
    if (quantity <= 0) throw new BadRequestError('Invalid quantity');
    const inventory = await InventoryRepository.findInventoryByProductID({ productID })
    if(!inventory) throw new NotFoundError('Inventory Not Found')
    return await InventoryRepository.updateInventoryStock({ 
        productID,
        incStock: -quantity
    })
}

module.exports = {
    decreaseInventoryStock,
    increaseInventoryStock,
    addStockOnProductCreation,
    deductStockOnOrder
}