/*
    NOHM  https://github.com/maritz/nohm
    //TUTORIAL http://maritz.github.io/nohm/
 */

console.log("%%%% LOADING REDIS_NOHM.js");

const redis = require('redis');

/*
    promisify
    http://redis.js.org/#redis-a-nodejs-redis-client-usage-example-promises
 */
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

const nohm = require('nohm').Nohm;

const constants = require('./../../../bin/constants');


nohm.setExtraValidations((__dirname !== '/' ? __dirname : '') +'/Redis/nohm/nohm.validation.js');
nohm.setExtraValidations((__dirname !== '/' ? __dirname : '') +'/Redis/nohm/nohm.iterator.js');

console.log("===> Connecting REDIS CLIENT");

var redisClient = null;

try{
    redisClient = redis.createClient(constants.DB_REDIS_PORT, constants.DB_REDIS_HOST, {password: constants.DB_REDIS_PASSWORD}); //creates a new client
}catch (exception) {
    console.error("============== ERROR REDIS CLIENT");
}

redisClient.on('connect', () => {
    console.log('===> REDIS connected\n');

    redisClient.select(constants.DB_REDIS_CURRENT_DB, (err,res) => {
        if (err){
            console.log("====> REDIS couldn't select redis DB "+constants.DB_REDIS_CURRENT_DB);
        } else {
            console.log('====> REDIS selecting worked')

            console.log("===> NOHM - setting REDIS CLIENT");
            nohm.setClient(redisClient);
        }
    });

});

redisClient.on('disconnect', () => {
    console.log('===> REDIS disconnected!!!\n');
});


module.exports =
    {
        nohm : nohm,
        redisClient : redisClient,
        redis: redis,
    };

