const { NotFoundError } = require("../../core/error.response")
const Cart = require("../../models/cart.model")
const Utils = require("../../utils")

const findCartByUserID = async ({ userID }) => {
    return Cart.findOne({ cart_user_id: userID });
}

const findCartById = async ({ cartID }) => {
    return await Cart.findOne({ _id: Utils.convertObjectId(cartID) }).lean()
}

const findListUserCart = async ({ userID }) => {
    return await Cart.findOne({ cart_user_id: userID }).lean()
}

const deleteUserCartItem = async ({ userID, productID, size }) => {
    const query = {
        cart_user_id: userID
    }

    const updateSet = {
        $pull: {
            cart_products: {
                _id: Utils.convertObjectId(productID),
                size: size
            }
        }
    }

    const deleteCart = await Cart.updateOne(query, updateSet).lean()
    return deleteCart
}

const createCart = async ({ userID, product }) => {
    // find
    const query = {
        cart_user_id: userID
    }
    const updateOrInsert = {
        // add new item if not exist
        $addToSet: { 
            cart_products: product
        }
    }
    // upsert: if query not found -> create new document with updateOrInsert
    // new: return new document
    const options = { upsert: true, new: true }

    return await Cart.findOneAndUpdate(query, updateOrInsert, options).lean()
}

const updateUserCartQuantity = async ({ userID, product }) => {
    const { _id: productID, quantity, size } = product

    const cart = await Cart.findOne({
        cart_user_id: userID,
        "cart_products._id": productID,
        "cart_products.size": size
    })

    if(!cart) throw new NotFoundError('Product Not Found')

    const updateSet = {
        // $inc : tang, giam
        $inc: {
            // if quantity > 0 -> increase, else reduce
            // $ : dai dien product dau tien khop voi dieu kien query 
            "cart_products.$.quantity": quantity
        }
    };

    const options = { new: true };
    return await Cart.findOneAndUpdate(
        {
            cart_user_id: userID,
            "cart_products._id": productID,
            "cart_products.size": size
        },
        updateSet,
        options
    ).lean()
}

const clearUserCart = async ({ userID }) => {
    return await Cart.findOneAndUpdate(
        { cart_user_id: userID },
        { $set: { cart_products: [] } },
        { new: true }
    ).lean();
}

module.exports = {
    findCartByUserID,
    findCartById,
    findListUserCart,
    deleteUserCartItem,
    createCart,
    updateUserCartQuantity,
    clearUserCart
}