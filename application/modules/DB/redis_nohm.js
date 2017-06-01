/*
    NOHM  https://github.com/maritz/nohm
    //TUTORIAL http://maritz.github.io/nohm/
 */

console.log("%%%% LOADING REDIS_NOHM.js");

var redis = require('redis');
var nohm = require('nohm').Nohm;

nohm.setExtraValidations(__dirname+'/nohm/nohm.validation.ts');
nohm.setExtraValidations(__dirname+'/nohm/nohm.iterator.ts');

console.log("===> Connecting REDIS CLIENT");
try{
    var redisClient = redis.createClient(constants.DB_RedisPort, constants.DB_RedisHost); //creates a new client
}catch (exception) {
    console.error("============== ERROR REDIS CLIENT");
}

redisClient.on('connect', function() {
    console.log('===> REDIS connected\n');

    redisClient.select(constants.DB_RedisCurrentDB, function(err,res){
        if (err){
            console.log("====> REDIS couldn't select redis DB "+constants.DB_RedisCurrentDB);
        } else {
            console.log('====> REDIS selecting worked')

            console.log("===> NOHM - setting REDIS CLIENT");
            nohm.setClient(redisClient);
        }
    });

});

redisClient.on('disconnect', function() {
    console.log('===> REDIS disconnected!!!\n');
});


module.exports =
    {
        nohm : nohm,
        redisClient : redisClient,
    };

