"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
const crypto = require("crypto");

class Utils {
  static sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

  static randomName = () => crypto.randomBytes(16).toString("hex");

  static convertObjectId = (id) => {
    return new Types.ObjectId(id);
  };

  static getInfoData = ({ field = [], object = {} }) => {
    return _.pick(object, field);
  };

  static getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
  };

  static unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
  };

  static removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        obj[key] = this.removeUndefinedObject(obj[key]);
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key];
        }
      }
    });
    return obj;
  };

  static updateNestedObjectParser = (obj) => {
    const final = {};
    const array = ["product_shop", "discount_shop_id"];
    Object.keys(obj).forEach((k) => {
      if (
        typeof obj[k] === "object" &&
        !Array.isArray() &&
        !array.includes(k)
      ) {
        const response = this.updateNestedObjectParser(obj[k]);
        Object.keys(response).forEach((a) => {
          final[`${k}.${a}`] = response[a];
        });
      } else {
        final[k] = obj[k];
      }
    });
    return final;
  };
}

module.exports = Utils;
