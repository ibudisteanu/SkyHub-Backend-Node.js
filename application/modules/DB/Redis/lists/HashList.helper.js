/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/5/2017.
 * (C) BIT TECHNOLOGIES
 */


var redis = require ('../../redis_nohm.js');

var HashList = class{

    constructor (tablePrefix){
        this.tablePrefix = tablePrefix || "Hash";
    }


    /*
        O(1)
     */
    async setHash(tableName, key, value){

        if (typeof value !== "string")
            value = JSON.stringify(value);

        return new Promise( (resolve)=> {
            redis.redisClient.hset(this.tablePrefix + ":" + tableName, key, value, function (err, answer) {

                console.log("setHash ",err,answer);

                resolve (err === null ? answer : null);
            });
        });

    }

    /*
        O(1)
    */
    async getHash(tableName, key){

        return new Promise( (resolve)=> {
            redis.redisClient.hget (this.tablePrefix + ":" + tableName, key, function (err, answer) {

                //console.log("getHash ",tableName+":"+key,"###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    /*
         O(N)
    */
    async getAllHash(tableName){

        return new Promise( (resolve)=> {
            redis.redisClient.hgetall (this.tablePrefix + ":" + tableName, function (err, answer) {

                console.log("getAllHash ##",key,"###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    async incrementBy(tableName, key, value){

        return new Promise( (resolve)=> {
            redis.redisClient.hincrby (this.tablePrefix + ":" + tableName, key, value, function (err, answer) {

                //console.log("hashIncrementBy ##",key,' value ',value,"###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    async deleteHash(tableName, key){
        return new Promise( (resolve)=> {
            redis.redisClient.hdel(this.tablePrefix + (typeof tableName !== 'undefined' ? ":" + tableName : ''), key, function (err, answer){

                console.log("deleteHash ",err, answer);
                resolve (err === null ? answer : null);
            });
        });
    }


};

module.exports = HashList;