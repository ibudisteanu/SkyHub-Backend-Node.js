/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var UniqueVisitorsHelper = require ('../visitors/helpers/UniqueVisitors.helper.ts');
var HashList = require ('../../../DB/Redis/lists/HashList.helper.ts');
var VoteType = require ('../../voting/models/VoteType.js');
var VotingsHelper = require ('../../voting/helpers/Votings.helper.ts');

var MaterializedParentsHelper = require ('../../../DB/common/materialized-parents/MaterializedParents.helper.ts');

class StatisticsHelper {

    //sortedList
    constructor(){
        this.hashList = new HashList("Statistics:Information");
    }

    //          UNIQUE VISITORS

    async addUniqueVisitorCounter(parentId, visitorIP){
        let res = await UniqueVisitorsHelper.addUniqueVisitor(parentId, visitorIP);
        await this.addPageViewCounter(parentId);

        return res;
    }

    async getUniqueVisitorsCounter(parentId){
        let rez = await UniqueVisitorsHelper.countUniqueVisitors(parentId);
        return (rez !== null ? rez : 0);
    }

    //          PAGE VIEWS

    async addPageViewCounter(parentId){
        return await this.hashList.incrementBy(parentId, 'PageViews', +1);
    }

    async setManuallyPageViewsCounter(parentId, value){
        return await this.hashList.setHash(parentId, 'PageViews', value);
    }

    async getPageViewsCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'PageViews');
        return (rez !== null ? rez : 0);
    }


    //          REPLIES

    async updateReplyCounter(parentId, value){

        if (typeof value === 'undefined') value = +1;

        return await this.hashList.incrementBy(parentId, 'Replies', vaue);
    }

    async getRepliesCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'PageViews');
        return (rez !== null ? rez : 0);
    }

    //          VOTES

    async getVoteCounter(parentId){
        // it is using the VotesHelper
        let rez = await VotingsHelper.getVote(parentId, null, true).vote;
        return (rez !== null ? rez : 0);
    }

    //          TOTAL VOTES

    async updateTotalVoteCounter (parentId, value){

        if (typeof value === 'undefined') value = 0;

        if (value !== 0)
            return await this.hashList.incrementBy(parentId, 'Votes', value);

        return false;
    }

    async getTotalVotesCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'Votes');
        return (rez !== null ? rez : 0);
    }

    //          TOTAL TOPICS

    async updateTotalTopicsCounter (parentId, value){

        if (typeof value === 'undefined') value = +1;

        return await this.hashList.incrementBy(parentId, 'Topics', value);

        return false;
    }

    async getTotalTopicsCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'Topics');
        return (rez !== null ? rez : 0);
    }

    //          TOTAL FORUMS

    async updateTotalForumsCounter (parentId, value){

        if (typeof value === 'undefined') value = +1;

        return await this.hashList.incrementBy(parentId, 'Forums', value);
    }

    async getTotalForumsCounter(parentId){
        let rez = await this.hashList.getHash(parentId, 'Forums');
        return (rez !== null ? rez : 0);
    }


    async keepParentsStatisticsUpdated(id, parents, enableNullParent, callback, value){

        if (typeof parents === "string") parents = [parents];

        let arrParentsUnique = MaterializedParentsHelper.getMaterializedParentsFromStringList(parents, [''] );

        for (let i = 0, len = arrParentsUnique.length; i < len; i++) {
            let parent = arrParentsUnique[i];

            if (((enableNullParent) && (parent === '')) || (parent !== '')) {

                await callback(parent, value);

            }
        }

    }


}

module.exports = new StatisticsHelper();