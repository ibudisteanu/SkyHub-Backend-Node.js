/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var ScoreCoefficientHelper = require ('../../../../DB/common/score-coefficient/ScoreCoefficient.helper.ts');
var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var TopContentHelper = require ('./../../top-content/helpers/TopContent.helper.ts');
var StatisticsHelper = require('../../../statistics/helpers/Statistics.helper.ts');

var RepliesSorter = class{

    constructor(){
        this.hashList = new HashList("TopObjects:Sorter:Topics");
    }

    async initializeSorterInDB(id, dtCreation){
        await this.hashList.setHash(id,"dtCreation", dtCreation);
    }

    async calculateHotnessVotingScore (id){

        let replies = await StatisticsHelper.getTotalRepliesCounter();
        let voteDiff = await StatisticsHelper.getVoteUpsCounter(id) - await StatisticsHelper.getVoteDownsCounter(id);

        return voteDiff + replies * 0.4;

    }

    async calculateHotnessCoefficient (id, dtCreation){

        let votingScore = await this.calculateHotnessVotingScore(id);
        return await ScoreCoefficientHelper.calculateHotnessScoreCoefficient(dtCreation, votingScore);
    }


    async keepSortedList (id, parents, bDelete){

        let dtCreation = await this.hashList.getHash(id, "dtCreation");

        let previousHotnessScore = await this.hashList.getHash(id, 'hotnessScore');
        let hotnessScore = await this.calculateHotnessCoefficient(id, dtCreation);

        if ((bDelete)||(previousHotnessScore !== hotnessScore))
            TopContentHelper.keepSortedObject(id, hotnessScore , parents, bDelete);
    }

};

module.exports = new RepliesSorter();