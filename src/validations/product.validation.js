'use strict'

const Joi = require('joi')
const validate = require('./base');

const create = validate(
  Joi.object({
    name: Joi.string()
      .required()
      .min(2)
      .max(100)
      .trim()
      .strict()
      .messages({
        'string.empty': 'Tên là bắt buộc',
        'string.min': 'Tên phải có ít nhất 2 ký tự',
        'string.max': 'Tên tối đa 100 ký tự',
        'any.required': 'Tên là bắt buộc',
      }),

    description: Joi.string()
      .max(256)
      .trim()
      .messages({
        'string.max': 'Mô tả tối đa 256 ký tự',
      }),

    price: Joi.number()
      .required()
      .min(0)
      .messages({
        'number.base': 'Giá phải là một số',
        'number.min': 'Giá phải lớn hơn hoặc bằng 0',
        'any.required': 'Giá là bắt buộc',
      }),

    discount: Joi.number()
      .min(0)
      .max(1)
      .default(0)
      .messages({
        'number.base': 'Giảm giá phải là một số',
        'number.min': 'Giảm giá không được âm',
        'number.max': 'Giảm giá tối đa là 1 (100%)',
      }),

    category: Joi.string()
      .required()
      .messages({
        'string.empty': 'Danh mục là bắt buộc',
        'any.required': 'Danh mục là bắt buộc',
      }),

    sizes: Joi.array()
      .items(
        Joi.object({
          size: Joi.number()
            .required()
            .min(1)
            .messages({
              'number.base': 'Size phải là một số',
              'number.min': 'Size phải lớn hơn 0',
              'any.required': 'Size là bắt buộc',
            }),
          stock: Joi.number()
            .required()
            .min(0)
            .messages({
              'number.base': 'Số lượng tồn kho phải là số',
              'number.min': 'Số lượng tồn kho không được âm',
              'any.required': 'Số lượng tồn kho là bắt buộc',
            }),
        })
      )
      .required()
      .min(1)
      .messages({
        'array.base': 'Sizes phải là một mảng',
        'array.min': 'Phải có ít nhất một kích cỡ',
        'any.required': 'Sizes là bắt buộc',
      }),

    code: Joi.string()
      .alphanum()
      .required()
      .trim()
      .strict()
      .messages({
        'string.alphanum': 'Mã chỉ được chứa ký tự chữ và số',
        'string.empty': 'Mã sản phẩm là bắt buộc',
        'any.required': 'Mã sản phẩm là bắt buộc',
      }),
  })
);



module.exports = {
    create,
}