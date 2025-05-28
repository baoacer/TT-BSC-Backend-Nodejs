require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
const helmet = require('helmet')
const { v4: uuidv4 } = require('uuid')
const compresstion = require('compression')
const router = require('./routers/index')
const app = express();
const myLogger = require('./loggers/mylogger.log')

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compresstion())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// log
app.use((req, res, next) => {
    const requestId = req.headers['x-request-id']
    req.requestId = requestId ? requestId : uuidv4()
    myLogger.log(`Input-[${req.method}]`, [
        req.path,
        { requestId: req.requestId },
        req.method === 'POST' ? req.body : req.query
    ])
    next()
})

// init database
require('./databases/init.mongodb')

// init router
app.use("/", router)

// init handle
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    return next(err)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500 //server

    const resMessage = `${err.status} - ${Date.now() - err.now}ms - Response: ${JSON.stringify(err)}`
    myLogger.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        { message: err.message }
    ])  

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        // stack: err.stack,
        message: err.message || 'Internal Server Error'
    })
})

module.exports = app