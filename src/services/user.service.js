'use strict'

const { BadRequestError, ConflictRequestError } = require('../core/error.response')
const USER = require('../models/user.model')

class UserService {
    static async newUser({
        email = null,
        captcha = null,
    }){
        // 1. check email
        const user = await USER.findOne({ email }).lean()
        if(user) return new ConflictRequestError('Email already exists')
        
        // 2. send token via email user

        
        return {
            token
        }

    }
}

module.exports = UserService