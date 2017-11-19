/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
        USING Hyperloglog   https://stackoverflow.com/questions/41616082/count-unique-visitors-with-redis-or-aerospike

        Full documentation: https://gist.github.com/DavidJFelix/113fad6a0a7affdd880d

 */

import * as redis from 'DB/redis_nohm'

class UniqueVisitorsHelper {

    constructor(){

        this.tablePrefix = "Statistics:UniqueVisitors";

    }

    /*
            O(1)
     */
    addUniqueVisitor (parentId, visitorIP){

        if (typeof visitorIP === 'string') visitorIP = this.convertIPtoNumber(visitorIP);

        return new Promise( (resolve)=> {
            redis.redisClient.pfadd (this.tablePrefix + ":" + parentId, visitorIP, function (err, answer) {

                resolve (err === null ? answer : null);

            });
        });
    }

    /*
            O(1)
     */
    async countUniqueVisitors(parentId){
        return new Promise( (resolve)=> {
            redis.redisClient.pfcount (this.tablePrefix + ":" + parentId, function (err, answer) {

                resolve (err === null ? answer : null);

            });
        });
    }


    convertIPtoNumber(IP)
    {
        var d = IP.split('.');
        return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
    }

    convertNumberToIP(num){
        var d = num%256;
        for (var i = 3; i > 0; i--)
        {
            num = Math.floor(num/256);
            d = num%256 + '.' + d;
        }
        return d;
    }

}

module.exports = new UniqueVisitorsHelper();