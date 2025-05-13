'use strict'
const { AuthFailureError } = require('../core/error.response')
const rbac = require('./role.middleware')
const RBACService = require('../services/rbac.service')

/**
 * @param {string} action - read, create, update, delete
 * @param {string} resource - profile, balance 
 */
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try{
            // giảm performance -> 1.redis, 2.xuất thành file json
            rbac.setGrants(await RBACService.roleList({})) // set grants from database
            const roleName = req.query.role
            const permission = rbac.can(roleName)[action](resource)
            if(!permission.granted){
                throw new AuthFailureError('You do not have enough permission to perform this action')
            }
            next()
        }catch (error){
            next(error)
        }
    }
} 

module.exports = {
    grantAccess
}