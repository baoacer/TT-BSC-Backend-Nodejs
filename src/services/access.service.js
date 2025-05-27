const shopModel = require("../models/shop.model")
const bycrypt = require("bcrypt")
const crypto = require("crypto")
const KeyService = require("./key.service")
const AuthUtils = require("../auth/auth.utils")
const Utils = require("../utils")
const { BadRequestError, AuthFailureError, FobiddenError } = require("../core/error.response")
const ShopService = require("./shop.service")
const { SHOP, ROLE } = require('../configs/contants')
const UserRepository = require("./repositories/user.repo")

const signUp = async ({
    email = null,
    password = null,
    name = null,
    address = null,
    phone = null
}) => {
    try {
        // 1. check email
        const user = await UserRepository.findUserByEmail({email})
        if(user) throw new ConflictRequestError('Email already exists')

        // 2. hash password
        const passwordHash = await bycrypt.hash(password, 10)

        // 3. create new user
        const newUser = await UserRepository.createUser({
            email: email,
            password: passwordHash,
            name: name,
            address: address,
            phone: phone
        })

        return newUser;
    } catch (error) {
        throw new Error(error)
    }
}

const login = async ({
    email = null,
    password = null
}) => {
    try {
        // 1. check email
        const user = await UserRepository.findUserByEmail({ email })
        if(!user) throw new AuthFailureError('User not register')

        // 2. check password
        const isMatch = await bycrypt.compare(password, user.password)
        if(!isMatch) throw new AuthFailureError('Password is incorrect')

        return {
            user: Utils.unGetGetData(user, ['password']),
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    signUp,
    login
}