const Order = require("../../models/order.model");
const { PAYMENT, PAYMENT_STATUS } = require("../../configs/contants");
const mongoose = require("mongoose");

const createOrder = async ({
  user,
  products = [],
  shipping = {},
  payment = {},
  checkout = {},
  note,
}) => {
  const order = await Order.create({
    user,
    products,
    shipping,
    payment,
    checkout,
    note,
  });

  return order;
};

const updateOrderStatus = async ({ orderID, status }) => {
  return await Order.findByIdAndUpdate(
    orderID,
    { status: status },
    { new: true }
  ).lean();
};

const updatePaymentStatus = async ({ orderID, status }) => {
  return await Order.findByIdAndUpdate(
    orderID,
    { "payment.status": status },
    { new: true }
  ).lean();
};

const findOrderById = async ({ orderID }) => {
  return await Order.findOne({ _id: orderID }).lean();
};

const deleteOrderById = async ({ orderID }) => {
  return await Order.deleteOne({ _id: orderID });
};

const getAllOrderByUserID = async ({ userID }) => {
  const sort = { createdAt: -1 };
  return await Order.find({ user: userID }).sort(sort).lean();
};

const getOrdersByAdmin = async ({
  limit = 20,
  page = 1,
  sort = { createdAt: -1 },
  status,
  search,
}) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    const orConditions = [];

    if (mongoose.Types.ObjectId.isValid(search)) {
      orConditions.push({ _id: new mongoose.Types.ObjectId(search) });
    }

    orConditions.push(
      { "shipping.name": { $regex: search, $options: "i" } },
      { "shipping.phone": { $regex: search, $options: "i" } },
      { "shipping.address": { $regex: search, $options: "i" } }
    );

    filter.$or = orConditions;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createOrder,
  findOrderById,
  getAllOrderByUserID,
  updateOrderStatus,
  updatePaymentStatus,
  getOrdersByAdmin,
  deleteOrderById,
};
