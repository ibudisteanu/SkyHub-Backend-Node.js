/**
 * Created by BIT TECHNOLOGIES on 6/1/2017.
 *
 * SortedList aka ZLIST
 *
 * TUTORIAL based on https://stackoverflow.com/questions/30725358/node-js-redis-zadd-objects-to-a-set
 *
 */

import * as redis from 'DB/redis_nohm'

var MaterializedParentsHelper = require ('../../../common/materialized-parents/MaterializedParents.helper.js');

var SortedList = class{

    constructor (tablePrefix, trimMaxCount){
        this.tablePrefix = tablePrefix || "ZLIST";

        this.trimMaxCount = trimMaxCount || 0;
    }

    setNewTablePrefix(sNewPrefix){
        this.tablePrefix = sNewPrefix;
    }

    /*
        O(log(N)) for each item added, where N is the number of elements in the sorted set.
     */

    async addElement(tableName, score, key){

        if (typeof key !== "string")
            key = JSON.stringify(key);

        return new Promise( (resolve)=> {

            redis.redisClient.zadd(this.tablePrefix+":"+tableName, score, key, async (err, answer) => {

                if ((err === null)&&(this.trimMaxCount !== 0)) this.trim(tableName);

                resolve (err === null ? answer : null);
            });

        });
    }

    /*
        O( 2 * log(N)) for each updated
     */

    async updateElement(tableName, value, key){

        let iCurrentScore = await this.getItemsMatching(tableName,key,0,1);

        try {
            iCurrentScore = iCurrentScore[1][1];
        }catch (ex){
            console.error("ERROR READING PREVIOUS SCORE for: ",tableName, value, key);
            iCurrentScore = 0;
        }

        //console.log("CURRENT SCORE", iCurrentScore);
        if (typeof iCurrentScore === "undefined")  //creating a new value, in case it didn't exist
            return this.addElement(tableName, value, key);
        else //updating the value
            return this.incrementBy(tableName, value-iCurrentScore, key );
    }

    /*
        O(log(N))
     */

    async incrementBy(tableName, value, key, ){
        return new Promise( (resolve)=> {
            redis.redisClient.zincrby(this.tablePrefix + ":" + tableName, value, key, async (err, answer) => {

                if ((err === null)&&(this.trimMaxCount !== 0)) this.trim(tableName);

                resolve (err === null ? answer : null);
            });
        });
    }

    /*
        Time complexity: O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.
        https://redis.io/commands/zrem
     */
    async deleteElement(tableName, key){
        return new Promise( (resolve)=> {
            redis.redisClient.zrem(this.tablePrefix + ":" + tableName, key, (err, answer) => {
                resolve (err === null ? answer : null);
            });
        });
    }

    /*
        Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).
     */

    async getListRangeByScore(tableName, iScoreMin, iScoreMax){

        return new Promise( (resolve) => {

            redis.redisClient.zrangebyscore(this.tablePrefix + ":" + tableName, iScoreMin, iScoreMax, (err, answer) => {
                if (err === null) resolve(answer);
                else resolve ([]);
            });
        });
    }

    /*
        Time complexity: O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.


        todo: to return iArticlesPerPage +1 to know if there are more articles
     */
    async getListRangeBySortedIndex(tableName, iPageIndex, iArticlesPerPage){
        iPageIndex = iPageIndex || 0;
        iArticlesPerPage = iArticlesPerPage || 8;

        let start = (iPageIndex-1) * iArticlesPerPage;
        let end = start + iArticlesPerPage - 1;

        return new Promise( (resolve) => {

            redis.redisClient.zrange(this.tablePrefix+":"+tableName, start, end, (err, answer) => {

                //console.log("ITEMS MATCHING ",answer);

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
            redis.redisClient.zscan(this.tablePrefix + ":" + tableName || "", iOffset||0, 'MATCH', '*'+(sMatch !== '' ? sMatch+ '*' : ''),  (err, answer) => {

                //console.log("ITEMS MATCHING ",answer);

                if (err === null) resolve(answer);
                else resolve([]);

            });
        });
    }

    async getFastItems(tableName, iPageIndex, iArticlesPerPage){

        iPageIndex = iPageIndex || 0;
        iArticlesPerPage = iArticlesPerPage || 8;

        let iOffset = 0;

        if (iPageIndex > 0)
            iOffset = iPageIndex * iArticlesPerPage;

        //return this.getItemsMatching(tableName, '', iOffset, iArticlesPerPage); //unstable, it returns different values
        return this.getListRangeBySortedIndex(tableName, iPageIndex, iArticlesPerPage);

    }

    async getRankItem(tableName, item){

        return new Promise( (resolve)=> {
            redis.redisClient.zrank(this.tablePrefix+":"+tableName||"", item, (err, answer) => {

                if (err === null)  resolve(answer);
                else resolve (-1);
            });
        });
    }

    async countList(tableName){

        return new Promise( (resolve)=> {
                redis.redisClient.zcard(this.tablePrefix + ":" + tableName||"", (err, answer) => {

                    if (err === null)  resolve(answer);
                    else resolve (-1);

            });
        });
    }

    /*
        O(log(N)) with N being the number of elements in the sorted set.
        https://redis.io/commands/zcount
     */
    async countListBetweenMinMax(tableName, min, max){
        return new Promise( (resolve)=> {
            redis.redisClient.zcount(this.tablePrefix+":"+tableName||"", min, max, (err, answer) => {

                if (err === null) resolve (answer);
                else resolve ([]);

            });

        });
    }


    async intersectionInStore(tableOutputName, argumentsIntersection){
        return new Promise( (resolve)=>{

            //creating the prefixes
            for (let i = 0; i<argumentsIntersection.length; i++)
                argumentsIntersection[i] = this.tablePrefix+":"+argumentsIntersection[i];

            let cmd = [this.tablePrefix+":"+tableOutputName, argumentsIntersection.length];
            redis.redisClient.zinterstore(cmd.concat(argumentsIntersection),  (err, answer)=>{

                if (err === null) resolve(answer);
                else resolve (null);

            })

        });
    }

    /*
        O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.
        https://redis.io/commands/zremrangebyrank
     */
    async removeRangeByRank( tableName, start, end ){

        if (typeof end === 'undefined') end = 100000;

        return new Promise( (resolve)=>{

            redis.redisClient.ZREMRANGEBYRANK(this.tablePrefix+":"+tableName||"", start, end, (err, answer) => {

                if (err === null) resolve(answer);
                else resolve (null);

            })

        });

        return true;
    }

    async trim(tableName){
        return await this.removeRangeByRank(tableName, this.trimMaxCount);
    }


    /*
        O(parents+1) * O(log(N)),
        where N is the MAX_LENGTH of the top objects
     */

    async keepSortedObject( key, score, parents, bDelete , enableNullParent ){

        if (typeof enableNullParent === "undefined" ) enableNullParent = true;
        if (typeof parents === "string") parents = [parents];

        let arrParentsUnique = MaterializedParentsHelper.getMaterializedParentsFromStringList(parents, [''] );

        for (let i = 0, len = arrParentsUnique.length; i < len; i++) {
            let parent = arrParentsUnique[i];

            if (((enableNullParent)&&(parent === ''))||(parent !== '')){

                if (bDelete||false == true)
                    await this.deleteElement(parent,key);
                else
                    await this.addElement(parent,score,key);
            }
        }

        return true;
    }


};

module.exports = SortedList;