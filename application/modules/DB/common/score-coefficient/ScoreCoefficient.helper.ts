/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/4/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../redis_nohm.js');

var ScoreCoefficient = class{

    constructor (tablePrefix){

    }

    /*
        IT IS BASED ON https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9
     */

    calculateHotnessScoreCoefficient(object, dtDate){

        if (typeof dtDate === "undefined") dtDate = object.dtCreation || new Date();

        var epoch = new Date(1993,12, 1);

        var diffSeconds = Math.ceil(  (dtDate.getTime() - epoch.getTime()) / 1000 );

        var votingScore = 0 - 0;

        var order = Math.log( Math.max( Math.abs(votingScore), 1) ) * Math.LOG10E;

        var sign = 1;
        if (votingScore > 0) sign = 1;
        else if (order < 0) sign = -1;
        else sign = 0;


        var seconds = diffSeconds - Math.ceil ( epoch.getTime() / 1000 );

        return Math.round(sign * order + seconds / 45000 * 10000000)/10000000;
    }

    async test(){


    }

};

module.exports = new ScoreCoefficient;