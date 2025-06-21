// middlewares/base.js
const { ErrorResponse } = require('../core/error.response');
const { StatusCodes } = require('http-status-codes');

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      next(new ErrorResponse(error.message, StatusCodes.UNPROCESSABLE_ENTITY));
    }
  };
};

module.exports = validate;
