/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/4/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../redis_nohm.js');
var VotingsHashList = require('REST/voting/helpers/Votings.hashlist.js');

var ScoreCoefficient = class{

    constructor (tablePrefix){

    }

    /*
        IT IS BASED ON https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9
     */

    calculateHotnessScoreCoefficient(dtDate, votingScore){
        if (typeof dtDate === "undefined")  dtDate = new Date();

        dtDate = (((typeof dtDate === "string")&&(dtDate !== ''))) ? Date.parse(dtDate) : new Date(dtDate||new Date());

        let epoch = new Date(1970, 1, 1);

        let diffSeconds = Math.ceil(  (dtDate.getTime() - epoch.getTime()) / 1000 );
        //the difference of the dtCreation's date and epoch... it should be always positive and every second the number should grow...

        //let votingScore = 0-0;

        let order = Math.log( Math.max( Math.abs(votingScore), 1) ) * Math.LOG10E;

        let sign = 1;
        if (votingScore > 0) sign = 1;
        else if (votingScore < 0) sign = -1;
        else sign = 0;

        console.log('     @@@###  ',votingScore, order, sign);

        let seconds = diffSeconds - 1134028003;

        let result = Math.round( (sign * order + seconds / 45000) * 10000000)/10000000;

        return - result; //returning because Redis is storing the inverse order
    }

    async test(){


    }

};

module.exports = new ScoreCoefficient;