'use strict'
const { SuccessResponse } = require('../core/success.response')
const UserService = require('../services/user.service')
const { StatusCodes } = require('../utils/handler/http.status.code')

const login = async (req, res, next) => {
    try {
        const user = await UserService.login(req.body)
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: 'Login successfully',
            data: user
        })
    } catch (error) {
        next(error)
    }
}

const signUp = async (req, res, next) => {
    try {
        const user = await UserService.signUp(req.body)
        return res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED,
            message: 'SignUp successfully',
            data: user
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    login,
    signUp
}