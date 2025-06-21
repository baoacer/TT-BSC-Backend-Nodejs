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

const signToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, SECRET, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};

module.exports = {
    signToken, verifyToken, 
}