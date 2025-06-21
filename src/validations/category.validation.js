'use strict'

const Joi = require('joi')
const validate = require('./base');

const create = validate(
  Joi.object({
    name: Joi.string()
      .required()
      .min(2)
      .max(50)
      .trim()
      .strict()
      .messages({
        'string.empty': 'Tên là bắt buộc',
        'string.min': 'Tên phải có ít nhất 2 ký tự',
        'string.max': 'Tên tối đa 50 ký tự',
        'any.required': 'Tên là bắt buộc',
      }),
  })
);


module.exports = {
    create,
}