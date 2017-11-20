/**
 * Created by ERAZER-ALEX on 4/25/2017.
 */


import constants from 'bin/constants'

let redis = require('redis');

let redisClient = redis.createClient(constants.DB_REDIS_HOST, constants.DB_REDIS_PORT); //creates a new client

redisClient.on('connect', () => {
    console.log('REDIS connected\n');
});

redisClient.on('disconnect', () => {
    console.log('REDIS disconnected!!!\n');
});



//TUTORIAL https://www.sitepoint.com/using-redis-node-js/