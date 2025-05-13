"use strict";
const RESOURCE = require("../models/resource.model");
const ROLE = require("../models/role.model");
const { BadRequestError, AuthFailureError } = require("../core/error.response");

/**
 * create resource
 * get resource
 * create role
 * get role
 */

class RBACService {
  static createResource = async ({
    name = "profile",
    slug = "p001",
    description = "",
  }) => {
    try {
      const foundResource = await RESOURCE.findOne({
        src_slug: slug,
      });

      if (foundResource) throw new BadRequestError("Resource already exists");

      const resource = await RESOURCE.create({
        src_name: name,
        src_slug: slug,
        src_description: description,
      });

      return resource;
    } catch (error) {
      return error;
    }
  };

  static resourceList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
  }) => {
    try {
      offset = Number(offset) || 0;
      limit = Number(limit) || 30;
      // 1. check admin
      //   if (userId !== 0 && userId !== undefined && userId !== null) {
      //     const isAdmin = await ROLE.findOne({ rol_name: "admin", userId });
      //     if (!isAdmin)
      //       throw new AuthFailureError(
      //         "You do not have enough permission to perform this action"
      //       );
      //   }

      // 2. get list resource
      // 2.1 search
      const mathCondition = {};
      if (search && search.length > 0) {
        mathCondition.$or = [
          { src_name: { $regex: search, $options: "i" } }, // Tìm kiếm theo tên (không phân biệt hoa thường)
          { src_slug: { $regex: search, $options: "i" } }, // Tìm kiếm theo slug
        ];
      }
      const resources = await RESOURCE.aggregate([
        {
          $match: mathCondition,
        },
        {
          $project: {
            _id: 0,
            resource_id: "$_id",
            name: "$src_name",
            slug: "$src_slug",
            description: "$src_description",
            createdAt: 1,
          },
        },
        { $skip: offset },
        { $limit: limit },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      return resources;
    } catch (error) {
      return error;
    }
  };

  static createRole = async ({
    name = "shop",
    slug = "s001",
    description = "",
    grants = [],
  }) => {
    try {
      // 1. check role exists
      const foundRole = await ROLE.findOne({
        rol_slug: slug,
      });

      if (foundRole) throw new BadRequestError("Role already exists");

      // 2.new role
      const role = await ROLE.create({
        rol_name: name,
        rol_slug: slug,
        rol_description: description,
        rol_grants: grants,
      });

      return role;
    } catch (error) {
      return error;
    }
  };

  static roleList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
  }) => {
    try {
      offset = Number(offset) || 0;
      limit = Number(limit) || 30;
      // 1. check admin?

      const mathCondition = {};
      if (search && search.length > 0) {
        mathCondition.$or = [
          { src_name: { $regex: search, $options: "i" } }, // Tìm kiếm theo tên (không phân biệt hoa thường)
          { src_slug: { $regex: search, $options: "i" } }, // Tìm kiếm theo slug
        ];
      }

      // 2. get list role
      const roles = await ROLE.aggregate([
        { $match: mathCondition },
        {
          // tách mảng grants thành nhiều dòng
          $unwind: "$rol_grants",
        },
        {
          // join với bảng resource
          $lookup: {
            from: "Resources",
            localField: "rol_grants.resource", // Trường trong collection hiện tại
            foreignField: "_id", // Trường trong collection được join
            as: "resource",
          },
        },
        {
          // tách mảng resource thành nhiều dòng
          $unwind: "$resource",
        },
        {
          $project: {
            role: "$rol_name",
            resource: "$resource.src_name",
            action: "$rol_grants.actions",
            attribute: "$rol_grants.attributes",
          },
        },
        {
          $unwind: "$action",
        },
        {
          $project: {
            _id: 0,
            role: 1,
            resource: 1,
            action: "$action",
            attribute: 1,
          },
        },
        { $skip: offset },
        { $limit: limit },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      return roles;
    } catch (error) {}
  };
}

module.exports = RBACService;
