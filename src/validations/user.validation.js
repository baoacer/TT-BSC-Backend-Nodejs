'use strict'

const Joi = require('joi')
const validate = require('./base')

const email = validate(
  Joi.object({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .trim()
      .strict()
      .messages({
        'string.email': 'Email phải đúng định dạng hợp lệ',
        'string.empty': 'Email là bắt buộc',
        'any.required': 'Email là bắt buộc',
      }),
  })
);

const login = validate(
  Joi.object({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .trim()
      .strict()
      .messages({
        'string.email': 'Email phải đúng định dạng hợp lệ',
        'string.empty': 'Email là bắt buộc',
        'any.required': 'Email là bắt buộc',
      }),
    password: Joi.string()
      .required()
      .min(6)
      .trim()
      .strict()
      .messages({
        'string.empty': 'Mật khẩu là bắt buộc',
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'any.required': 'Mật khẩu là bắt buộc',
      }),
  })
);

const update = validate(
  Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .strict()
      .messages({
        'string.base': 'Tên phải là chuỗi ký tự',
        'string.min': 'Tên phải có ít nhất 2 ký tự',
        'string.max': 'Tên không được vượt quá 50 ký tự',
      }),
    address: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .strict()
      .messages({
        'string.base': 'Địa chỉ phải là chuỗi ký tự',
        'string.min': 'Địa chỉ phải có ít nhất 2 ký tự',
        'string.max': 'Địa chỉ không được vượt quá 100 ký tự',
      }),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]{7,15}$/)
      .trim()
      .strict()
      .messages({
        'string.pattern.base': 'Số điện thoại không hợp lệ (chỉ chứa số, +, -, khoảng trắng, hoặc ngoặc)',
        'string.empty': 'Số điện thoại là bắt buộc',
      }),
  })
);


module.exports = {
    email,
    login,
    update
}