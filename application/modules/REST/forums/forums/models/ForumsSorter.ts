/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var ScoreCoefficientHelper = require ('../../../../DB/common/score-coefficient/ScoreCoefficient.helper.ts');
var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var TopForumsHelper = require ('./../../top-content/helpers/TopForums.helper.ts');
var StatisticsHelper = require('../../../statistics/helpers/Statistics.helper.ts');

var ForumSorter = class{

    constructor(){
        this.hashList = new HashList("TopObjects:Sorter:Forums");
    }

    async initializeSorterInDB(id, dtCreation){
        await this.hashList.setHash(id,"dtCreation", dtCreation);
    }

    async calculateHotnessVotingScore (id){

        let forums = await StatisticsHelper.getTotalForumsCounter();
        let topics = await StatisticsHelper.getTotalTopicsCounter();
        let replies = await StatisticsHelper.getTotalRepliesCounter();

        let voteDiff = await StatisticsHelper.getTotalVoteUpsCounter(id) - await StatisticsHelper.getTotalVoteDownsCounter(id);

        return forums + topics*0.7 + replies * 0.4 + voteDiff*0.1;

    }

    async calculateHotnessCoefficient (id, dtCreation){

        let votingScore = await this.calculateHotnessVotingScore(id);
        return await ScoreCoefficientHelper.calculateHotnessScoreCoefficient(dtCreation, votingScore);
    }


    async calculateKeepSortedList (id, parents, bDelete){

        let dtCreation = await this.hashList.getHash(id, "dtCreation");

        let previousHotnessScore = await this.hashList.getHash(id, 'hotnessScore');
        let hotnessScore = await this.calculateHotnessCoefficient(id, dtCreation);

        if ((bDelete)||(previousHotnessScore !== hotnessScore))
            TopForumsHelper.keepSortedObject(id, hotnessScore , parents, bDelete);
    }

};

module.exports = new ForumSorter();