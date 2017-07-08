/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var UniqueVisitorsHelper = require ('../visitors/helpers/UniqueVisitors.helper.ts');
var HashList = require ('../../../DB/Redis/lists/HashList.helper.ts');
var VoteType = require ('../../voting/models/VoteType.js');

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
        return await UniqueVisitorsHelper.countUniqueVisitors(parentId);
    }

    //          PAGE VIEWS

    async addPageViewCounter(parentId){
        return await this.hashList.incrementBy(parentId, 'PageViews', +1);
    }

    async getPageViewsCounter(parentId){
        return await this.hashList.getHash(parentId, 'PageViews');
    }


    //          REPLIES

    async addReplyCounter(parentId){
        return await this.hashList.incrementBy(parentId, 'Replies', +1);
    }

    async removeReplyCounter(parentId){
        return await this.hashList.incrementBy(parentId, 'Replies', -1);
    }

    async getRepliesCounter(parentId){
        return await this.hashList.getHash(parentId, 'PageViews');
    }

    //          VOTES

    async addVoteCounter (parentId, voteType){

        if (voteType !== VoteType.VOTE_NONE)
            return await this.hashList.incrementBy(parentId, 'Votes', voteType);

        return false;
    }

    async removeVoteCounter(parentId, voteType ){

        if (voteType !== VoteType.VOTE_NONE)
            return await this.hashList.incrementBy(parentId, 'Votes', voteType);

        return false;
    }

    async getVotesCounter(parentId){
        return await this.hashList.getHash(parentId, 'Votes');
    }


}

module.exports = new StatisticsHelper();