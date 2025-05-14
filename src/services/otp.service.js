'use strict'

const crypto = require('crypto')
const OTP = require('../models/opt.model')
class OtpService{
    static async generatorTokenRandom(){
        return crypto.randomInt(0, Math.pow(2, 32))
    }

    static async newOtp({ email = null }){
        const token = await this.generatorTokenRandom()
        const newToken = await OTP.create({
            otp_token: token,
            otp_email: email,
        })
        return newToken
    }
}

module.exports = OtpService