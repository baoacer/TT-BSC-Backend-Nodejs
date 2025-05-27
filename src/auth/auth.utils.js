"use strict";
const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'x-rtoken',
    AUTHORIZATION: 'authorization'
}

class Auth{
    static createTokenPair = async ({ payload, publicKey, privateKey }) => {
        try{
            const accessToken = jwt.sign( payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "2d"
            })

            const refreshToken = jwt.sign( payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "7d"
            })

            // jwt.verify(accessToken, publicKey, (err, decode) => {
            //     if(err){
            //         console.log(`Error Verify:: ${err}`)
            //     }else {
            //         console.log(`Decode Verify::${decode}`)
            //     }
            // })

            return { accessToken, refreshToken }
        }catch (error) {
            console.log(error)
        }
    }

    /*
        1 - Check shopId in header
        2 - Check key by shopId
        3 - Check accessToken in header
        4 - Verify accessToken
        5 - Return next 
    */
    static authentication = asyncHandler(async (req, res, next) => {
        // 1 - Check shopId in header
        const userId = req.headers[HEADER.CLIENT_ID]
        if(!userId) throw new AuthFailureError("Invalid Request")

        //  2 - Check key by shopId
        const key = await KeyService.findByUserId(userId)
        if(!key) throw new NotFoundError("Not Found Key")

         // 3 - get refreshToken from headers (authorization)
        if(req.headers[HEADER.REFRESHTOKEN]){
            try {
                const refreshToken = req.headers[HEADER.REFRESHTOKEN]
                req.key = key
                req.refreshToken = refreshToken
                return next()
            } catch (error) {
                throw error
            }
        } 

        const accessToken = req.headers[HEADER.AUTHORIZATION]
        if(!accessToken) throw new AuthFailureError('Invalid request')
        try {
            const decode = jwt.verify(accessToken, key.publicKey)
            if(userId !== decode.userId) throw new AuthFailureError('Invalid userId')
            req.key = key
            return next()
        } catch (error) {
            console.log(error)
        }
    })

    static verifyJWT = async({ token, publicKey }) => {
        return jwt.verify(token, publicKey)
    }
}

module.exports = Auth