/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var ScoreCoefficientHelper = require ('../../../../DB/common/score-coefficient/ScoreCoefficient.helper.ts');
var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var TopContentHelper = require ('./../../top-content/helpers/TopContent.helper.ts');

var TopicsSorter = class{

    constructor(){
        this.hashList = new HashList("TopObjects:Sorter:Topics");
    }

    async initializeSorterInDB(id, dtCreation){
        await this.hashList.setHash(id,"dtCreation", dtCreation);
    }

    async destroySorterInDB(id){
        await this.hashList.deleteHash('', id);
    }

    async calculateHotnessVotingScore (id){

        let StatisticsHelper = require('./../../../statistics/helpers/Statistics.helper.ts');

        let pageViews = await StatisticsHelper.getPageViewsCounter(id);
        let pageVisitorsViews = await StatisticsHelper.getUniqueVisitorsCounter(id);
        let replies = await StatisticsHelper.getTotalRepliesCounter(id);
        let voteDiff = await StatisticsHelper.getVoteUpsCounter(id) - await StatisticsHelper.getVoteDownsCounter(id);

        return voteDiff +  0.7*pageVisitorsViews + 0.2*pageViews  + 0.4*replies;

    }

    async calculateHotnessCoefficient (id, dtCreation){

        let votingScore = await this.calculateHotnessVotingScore(id);
        this.hashList.setHash(id,'hotnessCoefficient',votingScore);
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

        let votingScore = await this.calculateHotnessVotingScore(id);
        console.log('---------------------------------------------- ');
        console.log("    id#"+id+"#");
        console.log("    previousHotnessScore",previousHotnessScore);
        console.log("    hotnessScore",hotnessScore);
        console.log("         voting score", votingScore);
        console.log('---------------------------------------------- ');

        if ((bDelete)||(previousHotnessScore !== hotnessScore)) {

            this.hashList.setHash(id, "hotnessScore", hotnessScore);

            TopContentHelper.keepSortedObject(id, hotnessScore, parents, bDelete);
        }
    }

};

module.exports = new TopicsSorter();