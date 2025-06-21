const OrderService = require("../services/order.service");
const { StatusCodes } = require("../utils/handler/http.status.code");

const checkoutReview = async (req, res, next) => {
  try {
    const result = await OrderService.checkoutReview(req.body);
    console.log("checkoutReview result:", result);
    return res.status(StatusCodes.OK).json({
      metadata: result,
    });
  } catch (error) {
    next(error);
  }
};

const orderByUser = async (req, res, next) => {
  try {
    return res.status(StatusCodes.OK).json({
      metadata: await OrderService.orderByUser(req.body),
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrderByUser = async (req, res, next) => {
  try {
    const { userID } = req.params;
    return res.status(StatusCodes.OK).json({
      metadata: await OrderService.getAllOrderByUser({ userID }),
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderID } = req.params;
    const { status } = req.body;
    const order = await OrderService.updateOrderStatus({ orderID, status });
    res.status(StatusCodes.OK).json({
      metadata: order,
    });
  } catch (error) {
    next(error);
  }
};

const getOrdersByAdmin = async (req, res, next) => {
  try {
    const { limit, page, sort, status, search } = req.query;
    res.status(StatusCodes.OK).json({
      metadata: await OrderService.getOrdersByAdmin({
        limit,
        page,
        sort,
        status,
        search,
      }),
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrderByUser = async (req, res, next) => {
  try {
    const { orderID, userID } = req.body;
    res.status(StatusCodes.OK).json({
      metadata: await OrderService.cancelOrderByUser({ orderID, userID }),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkoutReview,
  orderByUser,
  getAllOrderByUser,
  updateOrderStatus,
  getOrdersByAdmin,
  cancelOrderByUser,
};
