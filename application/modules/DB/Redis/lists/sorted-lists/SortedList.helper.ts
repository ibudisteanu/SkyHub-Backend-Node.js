/**
 * Created by BIT TECHNOLOGIES on 6/1/2017.
 *
 * TUTORIAL based on https://stackoverflow.com/questions/30725358/node-js-redis-zadd-objects-to-a-set
 *
 */


var redis = require ('../../../redis_nohm.js');

var SortedList = class{

    constructor (tablePrefix){
        this.tablePrefix = tablePrefix || "ZLIST";
    }

    async addElement(tableName, score, key){

        if (typeof key !== "string")
            key = JSON.stringify(key);

        return new Promise( (resolve)=> {

            redis.redisClient.zadd(this.tablePrefix+":"+tableName, score, key, function (err, answer){
                resolve (err === null ? answer : null);
            });

        });
    }

    async updateElement(tableName, value, key){

        var iCurrentScore = await this.getItemsMatching(tableName,key,0,1);

        try {
            iCurrentScore = iCurrentScore[1][1];
        }catch (ex){
            console.error("ERROR READING PREVIOUS SCORE for: ",tableName, value, key);
            iCurrentScore = 0;
        }
        console.log("CURRENT SCORE",);

        return new Promise( (resolve)=> {

            redis.redisClient.zincrby(this.tablePrefix + ":" + tableName, value-iCurrentScore, key, function (err, answer){
                resolve (err === null ? answer : null);
            });
        });
    }

    async deleteElement(tableName, key){
        return new Promise( (resolve)=> {
            redis.redisClient.zrem(this.tablePrefix + ":" + tableName, key, function (err, answer){
                resolve (err === null ? answer : null);
            });
        });
    }

    /*
        Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
     */

    async getListRangeByScore(tableName, iScoreMin, iScoreMax){

        return new Promise( (resolve) => {

            redis.redisClient.zrangebyscore(this.tablePrefix + ":" + tableName, iScoreMin, iScoreMax, function (err, answer){
                if (err === null) resolve(answer);
                else resolve ([]);
            });
        });
    }

    /*
        Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.
     */
    async getListRangeBySortedIndex(tableName, iPageIndex, iArticlesPerPage){
        iPageIndex = iPageIndex || 0;
        iArticlesPerPage = iArticlesPerPage || 8;

        var start = (iPageIndex-1) * iArticlesPerPage;
        var end = start + iArticlesPerPage - 1;

        return new Promise( (resolve) => {

            redis.redisClient.zrange(this.tablePrefix+":"+tableName, start, end, function (err, answer){

                console.log("ITEMS MATCHING ",answer);

                if (err == null) resolve(answer);
                else resolve ([]);
            });

        });
    }


    /*
        Time complexity: O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..
     */

    async getItemsMatching(tableName, sMatch, iOffset, iCount){

        sMatch = sMatch || '';

        return new Promise( (resolve)=> {
            redis.redisClient.zscan(this.tablePrefix + ":" + tableName || "", iOffset||0, 'MATCH', '*'+(sMatch !== '' ? sMatch+ '*' : ''),function (err, answer) {

                console.log("ITEMS MATCHING ",answer);

                if (err === null) resolve(answer);
                else resolve([]);

            });
        });
    }

    async getFastItems(tableName, iPageIndex, iArticlesPerPage){

        iPageIndex = iPageIndex || 0;
        iArticlesPerPage = iArticlesPerPage || 8;

        var iOffset = 0;

        if (iPageIndex > 0)
            iOffset = iPageIndex * iArticlesPerPage;

        //return this.getItemsMatching(tableName, '', iOffset, iArticlesPerPage); //unstable, it returns different values
        return this.getListRangeBySortedIndex(tableName, iPageIndex, iArticlesPerPage);

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

    async keepSortedObject( key, score, parents, bDelete ){

        if (typeof parents === "string") parents = [parents];

        for (var i = 0, len = parents.length; i < len; i++) {
            var parent = parents[i];

            if (bDelete||false == true)
                await this.deleteElement(parent,key);
            else
                await this.addElement(parent,score,key);
        }

        return true;
    }

};

module.exports = SortedList;