/**
 * Created by BIT TECHNOLOGIES on 6/1/2017.
 *
 * TUTORIAL based on https://stackoverflow.com/questions/30725358/node-js-redis-zadd-objects-to-a-set
 *
 */

//var redis = require ('./../m../modules/DB/redis_nohm.js');
var redis = require ('../../..//DB/redis_nohm.js');

var SortedList = class{

    constructor (tablePrefix){
        this.tablePrefix = tablePrefix || "ZLIST";
    }

    addElement(tableName, score, value){

        if (typeof value !== "string")
            value = JSON.stringify(value);

        return redis.redisClient.zadd(this.tablePrefix+":"+tableName, score, value);

    }

    updateElement(tableName, score, object){

    }

    async deleteElement(tableName, object){
        return new Promise( (resolve)=> {
            redis.redisClient.zrem(this.tablePrefix + ":" + tableName, iRangeA, iRangeB, function (err, answer){
                resolve (err === null ? null : answer );
            });
        });
    }

    getListRangeByScore(tableName, iRangeA, iRangeB){
        return redis.redisClient.zrangebyscore(this.tablePrefix+":"+tableName, iRangeA, iRangeB);
    }

    /*
        Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
     */
    getListRange(tableName, iPageIndex, iArticlesPerPage){
        iPageIndex = iPageIndex || 0;
        iArticlesPerPage = iArticlesPerPage || 8;

        var start = (iPageIndex-1) * iArticlesPerPage;
        var end = start + iArticlesPerPage - 1;

        var ids = redis.redisClient.zrange(this.tablePrefix+":"+tableName, start, end);

        return ids;
    }


    /*
        Time complexity: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..
     */

    async getItem(tableName, iIndex){

        return new Promise( (resolve)=> {
            redis.redisClient.zscan(this.tablePrefix + ":" + tableName || "", 0, 'MATCH', '*'+iIndex + '*', function (err, answer) {

                if (err === null) resolve(answer);
                else resolve('');

            });
        });
    }

    async getRankItem(tableName, item){

        return new Promise( (resolve)=> {
            redis.redisClient.zrank(this.tablePrefix+":"+tableName||"", item, function (err, answer){

                if (err === null)  resolve(answer);
                else resolve (-1);
            });
        });
    }

    async countList(tableName){

        return new Promise( (resolve)=> {
                redis.redisClient.zcard(this.tablePrefix + ":" + tableName||"", function (err, answer) {

                    if (err === null)  resolve(answer);
                    else resolve (-1);

            });
        });
    }

    async countListBetweenMinMax(tableName, min, max){
        return new Promise( (resolve)=> {
            redis.redisClient.zcount(this.tablePrefix+":"+tableName||"", min, max, function(err, answer){

                if (err === null) resolve (answer);
                else resolve ([]);

            });

        });
    }

};

module.exports = SortedList;