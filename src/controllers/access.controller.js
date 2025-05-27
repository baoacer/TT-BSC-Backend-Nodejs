const AccessService = require('../services/access.service')
const { StatusCodes } = require('../utils/handler/http.status.code')

const login = async (req, res, next) => {
    try {
        const user = await AccessService.login(req.body)
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
        const user = await AccessService.signUp(req.body)
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