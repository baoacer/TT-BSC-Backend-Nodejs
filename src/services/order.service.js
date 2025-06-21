const CartRepository = require("./repositories/cart.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const ProductRepository = require("./repositories/product.repo");
const OrderRepository = require("./repositories/order.repo");
const UserRepository = require("./repositories/user.repo");
const { PAYMENT, ORDER_STATUS } = require("../configs/contants");
const VnPayService = require("./vnpay.service");
const InventoryRepository = require("./repositories/inventory.repo");
const {
  sendEmailOrderConfirm,
  sendEmailOrderCancel,
} = require("./email.service");
const { refundStock } = require("./inventory.service");

const checkoutReview = async ({ cartID }) => {
  /**
   * Check Cart Exists
   */
  const foundCart = await CartRepository.findCartById({ cartID: cartID });
  if (!foundCart) throw new NotFoundError("Cart Not Found");

  const cartProducts = foundCart.cart_products;
  if (!cartProducts || cartProducts.length === 0) {
    throw new BadRequestError("Giỏ hàng trống");
  }

  const checkoutOrder = {
    totalPrice: 0,
    totalDiscount: 0,
    totalCheckout: 0,
  };

  for (let i = 0; i < cartProducts.length; i++) {
    const { _id: productID, quantity } = cartProducts[i];

    /**
     * Check Product In Cart
     */
    const checkProductServer = await ProductRepository.findProductByID({
      productID,
    });
    if (!checkProductServer) throw new BadRequestError("Order Wrong");

    const { price, discount } = checkProductServer;

    /**
     * Calculator Total Price One Product
     */
    const checkoutPrice = price * quantity;

    /**
     * Calculator Total Price All Product
     */
    checkoutOrder.totalPrice += checkoutPrice;

    /**
     * Case Have Discount
     */
    if (discount > 0) {
      checkoutOrder.totalDiscount += price * quantity * discount;
    }
  }

  checkoutOrder.totalCheckout =
    checkoutOrder.totalPrice - checkoutOrder.totalDiscount;

  return checkoutOrder;
};

const orderByUser = async ({
  cartID,
  userID,
  payment,
  note,
  phone,
  address,
  name,
}) => {
  /**
   * Checkout Review
   */
  const { totalCheckout, totalPrice, totalDiscount } = await checkoutReview({
    cartID,
  });

  /**
   * Check User
   * Get List Cart Item
   */
  const user = await UserRepository.findUserByID({ userID });
  const { cart_products } = await CartRepository.findCartById({ cartID });
  if (!user) throw new NotFoundError("Wrong order");

  const products = [];
  for (const item of cart_products) {
    const { _id: productID, size, quantity } = item;

    const productInfo = await ProductRepository.findProductByID({ productID });
    const inventory = await InventoryRepository.getInventoryByProductID({
      productID,
    });

    /**
     * Check Stock Inventory
     */
    const sizeInventory = inventory.find((i) => i.size == size);
    if (!sizeInventory || sizeInventory.stock < quantity) {
      throw new BadRequestError(
        `Sản phẩm ${productID} size ${size} không đủ tồn kho`
      );
    }

    /**
     * Update Stock Inventory
     */
    await InventoryRepository.updateInventoryStock({
      productID: productInfo._id,
      size,
      incStock: -quantity,
    });

    products.push({
      product: productID,
      name: productInfo.name,
      size,
      quantity,
      image: productInfo.images.url,
      price: productInfo.price,
      discount: productInfo.discount || 0,
    });
  }

  const newOrder = await OrderRepository.createOrder({
    user: user._id,
    products,
    shipping: {
      address: address ? address : user.address,
      phone: phone ? phone : user.phone,
      name: name ? name : "",
    },
    payment: {
      method: payment,
    },
    checkout: {
      totalPrice,
      totalDiscount,
      totalCheckout,
    },
    note,
  });

  if (payment !== PAYMENT.VNPAY && newOrder) {
    await CartRepository.clearUserCart({ userID });
  }

  if (payment == PAYMENT.VNPAY) {
    return VnPayService.createPaymentUrl({
      orderAmount: newOrder.checkout.totalCheckout,
      orderType: payment,
      orderId: newOrder._id,
    });
  }

  return newOrder;
};

const updateOrderStatus = async ({ orderID, status }) => {
  const order = await OrderRepository.findOrderById({ orderID });
  if (!order) throw new NotFoundError("Order not found");

  if (
    status === ORDER_STATUS.CANCELLED &&
    order.order_status !== ORDER_STATUS.CANCELLED
  ) {
    for (const item of order.products) {
      await InventoryRepository.updateInventoryStock({
        productID: item.product,
        size: item.size,
        incStock: item.quantity,
      });
    }
  }

  const updatedOrder = await OrderRepository.updateOrderStatus({
    orderID: order._id,
    status,
  });

  const user = await UserRepository.findUserByID({ userID: updatedOrder.user });
  if (!user) throw new NotFoundError("User not found");

  if (status === ORDER_STATUS.CONFIRMED) {
    await sendEmailOrderConfirm({
      email: user.email,
      orderCode: orderID,
      customerName: user.name,
    });
  } else if (status === ORDER_STATUS.CANCELLED) {
    await sendEmailOrderCancel({
      email: user.email,
      orderCode: orderID,
      customerName: user.name,
    });
  }

  return updatedOrder;
};

const getAllOrderByUser = async ({ userID }) => {
  return await OrderRepository.getAllOrderByUserID({ userID });
};

const deleteOrderById = async ({ orderID }) => {
  await OrderRepository.deleteOrderById({ orderID });
};

const cancelOrderByUser = async ({ orderID, userID }) => {
  const order = await OrderRepository.findOrderById({ orderID });
  if (!order) throw new NotFoundError("Order not found");
  if (order.user.toString() !== userID.toString()) {
    throw new BadRequestError("Bạn không có quyền huỷ đơn này");
  }
  if (order.status === ORDER_STATUS.CANCELLED) {
    throw new BadRequestError("Đơn hàng đã huỷ trước đó");
  }

  // Hoàn lại tồn kho inventory
  for (const item of order.products) {
    await refundStock({
      productID: item.product,
      size: item.size,
      quantity: item.quantity,
    });
  }

  const updatedOrder = await OrderRepository.updateOrderStatus({
    orderID,
    status: ORDER_STATUS.CANCELLED,
  });
  return updatedOrder
};

const getOrdersByAdmin = async ({ limit, page, sort, status, search }) => {
  return await OrderRepository.getOrdersByAdmin({
    limit,
    page,
    sort,
    status,
    search,
  });
};

module.exports = {
  getAllOrderByUser,
  checkoutReview,
  orderByUser,
  updateOrderStatus,
  cancelOrderByUser,
  getOrdersByAdmin,
  deleteOrderById,
};
