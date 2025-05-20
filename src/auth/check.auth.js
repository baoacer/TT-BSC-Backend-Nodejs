"use strict";
const ApiKeyService = require("../services/apikey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

class CheckAuth {
    static apiKey = async (req, res, next) => {
        try{
            const key = req.headers[HEADER.API_KEY]
            if(!key){
                return res.status(403).json({
                    message: "Invalid Api Key"
                })
            }
            const existsKey = await ApiKeyService.findByKey(key)

            if(!existsKey){
                return res.status(403).json({
                    message: "Invalid Api Key"
                })
            } 

            req.objKey = existsKey

            return next()
        }catch (error) {

        }
    }

    static permission = (requiredPermission) => {
        return async (req, res, next) => {
            try {
                if (!req.objKey) {
                    return res.status(403).json({
                        message: "Permission denied", 
                    });
                }
    
                if (!req.objKey.permissions.includes(requiredPermission)) {
                    return res.status(403).json({
                        message: "Permission denied",
                    });
                }
    
                return next();
            } catch (error) {
                
            }
        };
    };
    
}

module.exports = CheckAuth