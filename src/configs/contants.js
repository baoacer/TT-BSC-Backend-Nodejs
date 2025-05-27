const ORDER_01 = "ORDER-01";
const ORDER_02 = "ORDER-02";
const PROMOTION_01 = "PROMOTION-01";
const SHOP_01 = "SHOP-01";

const SHOP = 'Shop';
const USER = 'User';
const ROLE = {
  USER: "user",
  SHOP: "shop",
  ADMIN: "admin",
};

const PAYMENT = {
  COD: 'COD',
  VNPAY: 'VNPAY'
}

// redis
REDIS_CONNECT_TIMEOUT = 10000
REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: 'Redis Server Error'
}

module.exports = {
  ORDER_01,
  ORDER_02,
  PROMOTION_01,
  SHOP_01,
  SHOP,
  USER,
  ROLE,
  REDIS_CONNECT_MESSAGE,
  REDIS_CONNECT_TIMEOUT,
  PAYMENT
};