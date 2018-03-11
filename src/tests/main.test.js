if(( typeof window !== 'undefined' && !window._babelPolyfill) ||
    ( typeof global !== 'undefined' && !global._babelPolyfill)) {
    require('babel-polyfill')
}

if ( typeof describe !== 'undefined') {

    //FOR TESTING ONLY
    //var redis = require('DB/redis_test.js');

    //JugglingDB it's NOT working
    //var redis = require ('DB/redisJugglingDB');

}

