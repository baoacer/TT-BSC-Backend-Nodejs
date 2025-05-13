'use strict'

const { SuccessResponse } = require("../core/success.response")
const RBACService = require("../services/rbac.service")


class RBACController {
    newRole = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new role success",
            metadata: await RBACService.createRole(req.body)
        }).send(res)
    }

    getRoles = async (req, res, next) => {
        new SuccessResponse({
            message: "Get roles success",
            metadata: await RBACService.roleList(req.query)
        }).send(res)
    }

    newResource = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new resource success",
            metadata: await RBACService.createResource(req.body)
        }).send(res)
    }

    getResources = async (req, res, next) => {
        new SuccessResponse({
            message: "Get resources success",
            metadata: await RBACService.resourceList(req.query)
        }).send(res)
    }
}

module.exports = new RBACController()