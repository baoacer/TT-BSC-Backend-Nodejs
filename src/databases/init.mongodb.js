"use strict";
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const { countConnect, checkOverload } = require('../helpers/check.connect');
const { HOST, PORT, DBNAME } = process.env
const connectString = `mongodb://${HOST}:${PORT}/${DBNAME}`;

class Database{
    constructor(){
        this.connect();
    }

    connect(type = 'mongodb'){
        if(1 === 1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }
        mongoose.connect(connectString, {maxPoolSize: 50}).then(() => {
            countConnect()
            console.log(`Connect Database Mongodb Successfully!::${DBNAME}`)
        }).catch((error) => {
            console.log(`Error Connect!: ${error}`)
        })
    }

    static getIntance(){
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance
    }
}

const instanceMongoDb = Database.getIntance();
module.exports = instanceMongoDb