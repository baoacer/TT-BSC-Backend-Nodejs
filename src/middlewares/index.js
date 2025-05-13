const { title } = require('process')
const Logger = require('../loggers/discord.log')


const pushLogDiscord = async (req, res, next) => {
    try{
        Logger.sendFormatCode({
            title: `Method ${req.method}`,
            code: req.method === 'GET' ? req.query : req.body,
            message: `${req.get('host')} ${req.originalUrl}`
        }) 
        return next()
    }catch(error){
        return next(error)
    }
}

module.exports = {
    pushToLogDiscord: pushLogDiscord
}

