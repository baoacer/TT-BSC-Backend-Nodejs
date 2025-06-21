"use strict";
const CartRepository = require("./repositories/cart.repo");
const ProductRepository = require("./repositories/product.repo");
const { NotFoundError } = require("../core/error.response");
const InventoryRepository = require("./repositories/inventory.repo");

const addToCart = async ({ userID, product = {} }) => {
  const { id: productID, quantity, size } = product;

  /**
   * 1. Check Inventory Stock 
   */
  const inventory = await InventoryRepository.getInventoryByProductID({
    productID,
  });

  const sizeInventory = inventory.find((i) => i.size == size);
  if (!sizeInventory || sizeInventory.stock < quantity) {
    throw new NotFoundError("Số lượng tồn kho không đủ");
  }

  /**
   * 2. Check Cart
   */
  const userCart = await CartRepository.findCartByUserID({ userID });

  /**
   * 3. Check Product Exist
   */
  const foundProduct = await ProductRepository.findProductUnSelect({
    productID,
    unSelect: ["createdAt", "updatedAt", "__v"],
  });
  if (!foundProduct) throw new NotFoundError("Product Not Found");

  /**
   * 4. Set Quantity, Size Product To Cart
   */
  foundProduct.quantity = quantity;
  foundProduct.size = size;

  /**
   * 5. Handle Cart Case
   */

  /**
   * 5.1. Cart Not Exists
   * Create Cart
   */
  if (!userCart) {
    return CartRepository.createCart({ userID, product: foundProduct });
  }

  /**
   * 5.2. Cart Exists
   * Not Have Product -> Add New Product
   */
  const isProductInCart = userCart.cart_products.findIndex(
    (p) =>
      p._id.toString() === foundProduct._id.toString() &&
      p.size === foundProduct.size
  );
  if (isProductInCart === -1) {
    userCart.cart_products.push(foundProduct);
    return await userCart.save();
  }

  /**
   * 5.3. Cart Exists
   * Have Product -> Update Quantity
   */
  if (isProductInCart !== -1) {
    const currentQuantity = userCart.cart_products[isProductInCart].quantity;
    const newQuantity = currentQuantity + quantity;

    const inventory = await InventoryRepository.getInventoryByProductID({ productID });
    const sizeInventory = inventory.find((i) => i.size == size);
    if (!sizeInventory || sizeInventory.stock < newQuantity) {
      throw new NotFoundError("Số lượng tồn kho không đủ");
    }

    return await CartRepository.updateUserCartQuantity({
      userID,
      product: { ...foundProduct, quantity }
    });
  }
};

const deleteUserCartItem = async ({ userID, productID, size }) => {
  return await CartRepository.deleteUserCartItem({ userID, productID, size });
};

const getListUserCart = async (userID) => {
  return await CartRepository.findListUserCart({ userID });
};

module.exports = {
  addToCart,
  deleteUserCartItem,
  getListUserCart,
};
