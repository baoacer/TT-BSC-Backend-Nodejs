'use strict'
const InventoryRepository = require('./repositories/inventory.repo')
const ProductRepository = require('./repositories/product.repo')
const { NotFoundError } = require('../core/error.response')

const addStockOnProductCreation = async ({
    productID, stock, location = null
}) => {
    const existProduct = await ProductRepository.findProductByID({ productID })
    if(!existProduct) throw new NotFoundError('Product Not Exist!')
    
    return await InventoryRepository.createInventory({
        productID, stock, location
    })
}

const refundStock = async ({  productID, size, quantity }) => {
    return await InventoryRepository.updateInventoryStock({
        productID, size, incStock: quantity
    })
}

module.exports = {
    addStockOnProductCreation, refundStock
}