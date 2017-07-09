/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var ScoreCoefficientHelper = require ('../../../../DB/common/score-coefficient/ScoreCoefficient.helper.ts');
var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var TopForumsHelper = require ('./../../top-content/helpers/TopForums.helper.ts');

var ForumSorter = class{

    constructor(){
        this.hashList = new HashList("TopObjects:Sorter:Forums");
    }

    async initializeSorterInDB(id, dtCreation){
        await this.hashList.setHash(id,"dtCreation", dtCreation);
    }

    async calculateHotnessVotingScore (id){

        let StatisticsHelper = require('./../../../statistics/helpers/Statistics.helper.ts');

        let pageViews = await StatisticsHelper.getPageViewsCounter(id);
        let pageVisitorsViews = await StatisticsHelper.getUniqueVisitorsCounter(id);

        let forums = await StatisticsHelper.getTotalForumsCounter(id);
        let topics = await StatisticsHelper.getTotalTopicsCounter(id);
        let replies = await StatisticsHelper.getTotalRepliesCounter(id);

        let voteDiff = await StatisticsHelper.getTotalVoteUpsCounter(id) - await StatisticsHelper.getTotalVoteDownsCounter(id);

        return forums + pageVisitorsViews *0.7 + pageViews *0.2 + topics*0.3 + replies * 0.1 + voteDiff*0.1;

    }

    async calculateHotnessCoefficient (id, dtCreation){

        let votingScore = await this.calculateHotnessVotingScore(id);

        return await ScoreCoefficientHelper.calculateHotnessScoreCoefficient(dtCreation, votingScore);
    }

    async getExistingHotnessCoefficient(id, dtCreation, parents){
        let hotnessScore = await this.hashList.getHash(id, 'hotnessScore');
        if (hotnessScore !== null) return hotnessScore;

        return 0;
    }

    async calculateKeepSortedList (id, parents, bDelete){

        let dtCreation = parseInt( await this.hashList.getHash(id, "dtCreation") );

        let previousHotnessScore = await this.hashList.getHash(id, 'hotnessScore');
        let hotnessScore = await this.calculateHotnessCoefficient(id, dtCreation);

        if ((bDelete)||(previousHotnessScore !== hotnessScore)) {

            this.hashList.setHash(id, "hotnessScore", hotnessScore);

            TopForumsHelper.keepSortedObject(id, hotnessScore, parents, bDelete);
        }
    }

};

module.exports = new ForumSorter();