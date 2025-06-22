require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
const helmet = require('helmet')
const { v4: uuidv4 } = require('uuid')
const compresstion = require('compression')
const router = require('./routers/index')
const app = express();
const myLogger = require('./loggers/mylogger.log')
const { getRedisClient } = require('../src/databases/init.redis')
require('./jobs/index')

const cors = require('cors')
app.use(cors({ 
    origin: "*"
}))

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

/**
 * Init Database
 */
require('./databases/init.mongodb')
getRedisClient()

/**
 * Init Router
 */
app.use("/", router)

/**
 * Init Handle
 */
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    return next(err)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500 

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