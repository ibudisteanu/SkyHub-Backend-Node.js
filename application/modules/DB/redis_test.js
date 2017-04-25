/**
 * Created by ERAZER-ALEX on 4/25/2017.
 */
var constants = require ('./../../../bin/constants');

var redis = require('redis');

var redisClient = redis.createClient(constants.DB_RedisHost, constants.DB_RedisPort); //creates a new client

redisClient.on('connect', function() {
    console.log('REDIS connected\n');
});

redisClient.on('disconnect', function() {
    console.log('REDIS disconnected!!!\n');
});



//TUTORIAL https://www.sitepoint.com/using-redis-node-js/