require("dotenv").config();
const { createClient } = require("redis");
const { REDIS_HOST, REDIS_PORT } = process.env;
const urlConnection = `redis://${REDIS_HOST}:${REDIS_PORT}`;
let instance;

const getRedisClient = async () => {
    if (!instance) {
    instance = createClient({ url: urlConnection });

    instance.on('connect', () => {
      console.log('Redis connected');
    });
    instance.on('end', () => {
      console.log('Redis disconnected');
    });
    instance.on('reconnecting', () => {
      console.log('Redis reconnecting');
    });
    instance.on('error', (err) => {
      console.log('Redis error:', err);
    });

    await instance.connect();
  }
  return instance;
};



module.exports = {
    getRedisClient
};
