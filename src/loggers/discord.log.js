'use strict'
require('dotenv').config();

// Client: bot
// GatewayIntentBits: permissions
const { Client, GatewayIntentBits } = require('discord.js')
const { DISCORD_TOKEN, CHANNEL_DISCORD_ID } = process.env

class LoggerService { 
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        this.channelID = CHANNEL_DISCORD_ID

        this.client.on('ready', () => { 
            console.log(`Logged in as ${this.client.user.tag}!`)
        })

        this.client.login(DISCORD_TOKEN).catch((error) => {
            console.error('Failed to log in:', error)
        })
    }

    async sendFormatCode(log){
        const { code, message = "", title = ""} = log

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title: title,
                    description: '```\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ]
        }

        this.sendMessage(codeMessage)
    }

    async sendMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelID)
        if(!channel){
            const error = `Channel ${this.channelID} not found!`
            console.error(error)
            return error
        }

        try {
            await channel.send(message)
        } catch (error) {
            console.error(error)
        }
    }


}

module.exports = new LoggerService()
