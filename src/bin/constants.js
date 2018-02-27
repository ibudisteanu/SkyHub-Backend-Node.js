/**
 * Created by ERAZER-ALEX on 4/25/2017.
 */

let DB_REDIS_CURRENT_DB_SKYHUB = 15;
let DB_REDIS_CURRENT_DB_AGGREGATOR = 6;

module.exports =
    {
        WEBSITE_URL : 'http://127.0.0.1:4000/',

        DB_REDIS_PORT : 6379,
        DB_REDIS_HOST: '127.0.0.1',
        DB_REDIS_CURRENT_DB : (  (process.env.AGGREGATOR || 'false') === 'true' ?  DB_REDIS_CURRENT_DB_AGGREGATOR : DB_REDIS_CURRENT_DB_SKYHUB),
        DB_REDIS_PASSWORD : '',

        APP_PORT : 4000,

        SESSION_SECRET_KEY : "",

        OAUTH2_FACEBOOK_SECRET : "",
        MONGO_CONNECTION_URI : '',

    };

