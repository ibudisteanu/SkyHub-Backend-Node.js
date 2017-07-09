/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/4/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../redis_nohm.js');
var VotingHelper = require('./../../../REST/voting/helpers/Votings.helper.ts');

var ScoreCoefficient = class{

    constructor (tablePrefix){

    }

    /*
        IT IS BASED ON https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9
     */

    calculateHotnessScoreCoefficient(dtDate, votingScore){

        if (typeof dtDate === "undefined")  dtDate = new Date();

        dtDate = (((typeof dtDate === "string")&&(dtDate !== ''))) ? Date.parse(dtDate) : new Date(dtDate||new Date());

        let epoch = new Date(1993, 12, 1);

        let diffSeconds = Math.ceil(  (dtDate.getTime() - epoch.getTime()) / 1000 );

        //let votingScore = 0-0;

        let order = Math.log( Math.max( Math.abs(votingScore), 1) ) * Math.LOG10E;

        let sign = 1;
        if (votingScore > 0) sign = 1;
        else if (order < 0) sign = -1;
        else sign = 0;


        let seconds = diffSeconds - Math.ceil ( epoch.getTime() / 1000 );

        return Math.round(sign * order + seconds / 45000 * 10000000)/10000000;
    }

    async test(){


    }

};

module.exports = new ScoreCoefficient;