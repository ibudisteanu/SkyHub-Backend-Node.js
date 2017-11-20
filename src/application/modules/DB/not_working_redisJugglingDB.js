/**
 * https://github.com/1602/jugglingdb
 * ORM DB for REDIS
 */

import constants from './../../../bin/constants';

var Schema = require('jugglingdb-redis-hq').Schema;
var schema = new Schema('redis-hq', {port: constants.DB_REDIS_HOST}); //port number depends on your configuration

// define models
var Post = schema.define('Post', {
    title:     { type: String, length: 255 },
    content:   { type: Schema.Text },
    date:      { type: Date,    default: function () { return new Date;} },
    timestamp: { type: Number,  default: Date.now },
    published: { type: Boolean, default: false, index: true }
});
