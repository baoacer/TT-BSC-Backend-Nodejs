'use strict'
const UserService = require('../services/user.service')
const { StatusCodes } = require('../utils/handler/http.status.code')

const login = async (req, res, next) => {
    try {
        const { user, accessToken} = await UserService.login(req.body)
        return res.status(StatusCodes.OK).json({
            metadata: {
                user,
                accessToken
            }
        })
    } catch (error) {
        next(error)
    }
}

const signup = async (req, res, next) => {
    try {
        const { token } = req.query
        const metadata = await UserService.signup({ token })
        return res.redirect(
          `http://localhost:5173/register-success?email=${encodeURIComponent(metadata.email)}&password=${encodeURIComponent(metadata.password)}`
        )
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
  try {
    const userID = req.user.userID
    const { currentPassword, newPassword } = req.body
    const result = await UserService.changePassword({ userID, currentPassword, newPassword })
    res.status(StatusCodes.OK).json({ 
        message: result ? "Success" : "Failed" 
    });
  } catch (error) {
    next(error);
  }
}

const reset = async (req, res, next) => {
    try {
        const { email } = req.body
        await UserService.reset({ email })
        res.status(StatusCodes.OK).json({
          message: "Vui lòng kiểm tra email"
        })
    } catch (error) {
        next(error)
    }
}

const activeUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await UserService.activeUser({ email });
        return res.status(StatusCodes.OK).json({
            message: user.isActive ? 'Active user successfully' : 'Block user successfully'
        });
    } catch (error) {
        next(error);
    }
};

const sendEmailSignup = async (req, res, next) => {
  try {
    await UserService.sendEmailSignup(req.body);
    res.json({ message: 'Vui lòng kiểm tra email để xác thực' });
  } catch (error) {
    next(error);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { userID } = req.params
    const status = await UserService.updateUserInfo({ userID, update: req.body })
    res.status(StatusCodes.OK).json({ 
        message: status
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page, limit, status, search, sort } = req.query
    res.status(StatusCodes.OK).json({ 
        metadata: await UserService.getUsers({page, limit, status, search, sort})
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    login,
    signup,
    activeUser,
    sendEmailSignup,
    updateUserInfo,
    getUsers,
    changePassword,
    reset
}