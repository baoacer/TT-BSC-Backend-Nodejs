'use strict'
const USER = require('../../models/user.model')

class UserRepository {
    static async createUser({
        email,
        password,
        name,
        address,
        phone
    }){
        return await USER.create({
            email,
            password,
            name,
            address,
            phone
        })
    }

    static async findUserByEmail({
        email
    }){
        return await USER.findOne({
            email: email
        }).lean()
    }

    static async findUserByID({
        userID
    }){
        return await USER.findOne({
            _id: userID
        }).lean()
    }

}

module.exports = UserRepository