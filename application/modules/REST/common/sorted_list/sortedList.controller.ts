/**
 * Created by BIT TECHNOLOGIES on 6/1/2017.
 *
 * TUTORIAL based on https://stackoverflow.com/questions/30725358/node-js-redis-zadd-objects-to-a-set
 *
 */

var redis = require ('./../modules/DB/redis_nohm.js');

var SortedList = class{

    tablePrefix = '';

    constructor (tablePrefix){
        this.tablePrefix = tablePrefix || "ZLIST";
    }

    addElement(tableName, score, object){

        if (typeof object !== "string")
            object = JSON.stringify(object);

        return redis.redisClient.zadd(this.tablePrefix+":"+tableName, score, object);
    }

    updateElement(tableName, score, object){

    }

    deleteElement(tableName, object){
        return redis.redisClient.zrem(this.tablePrefix+":"+tableName, iRangeA, iRangeB);
    }

    getListRangeByScore(tableName, iRangeA, iRangeB){
        return redis.redisClient.zrangebyscore(this.tablePrefix+":"+tableName, iRangeA, iRangeB);
    }

    getListRange(tableName, iPageIndex, iArticlesPerPage){
        iPageIndex = iPageIndex || 0;
        iArticlesPerPage = iArticlesPerPage || 8;

        var start = (iPageIndex-1) * iArticlesPerPage;
        var end = start + iArticlesPerPage - 1;

        var ids = redis.redisClient.zrevrange(this.tablePrefix+":"+tableName, start, end);

        return ids;
    }

    getItem(tableName, iIndex){
        redis.redisClient.zscan(this.tablePrefix+":"+tableName, 0, 'MATCH', iIndex + '*', functin(answer){

        });
    }

    getListCount(tableName){
        return redis.redisClient.zcard(this.tablePrefix+":"+tableName);
    }

};

module.exports = SortedList;