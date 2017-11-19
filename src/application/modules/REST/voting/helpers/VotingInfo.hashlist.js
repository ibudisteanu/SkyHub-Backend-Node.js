/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/2/2017.
 * (C) BIT TECHNOLOGIES
 */


let HashList = require ('../../../DB/Redis/lists/HashList.helper.js');

let VoteType = require ('../models/VoteType.js');

class VotingInfoHashList {

    //HashList
    constructor(){
        this.hashList = new HashList("Voting");
    }

    async getVoteUpsValue(parentId){
        let res = await this.hashList.getHash(parentId, 'ups');
        return res !== null ? res : 0;
    }

    async getVoteDownsValue(parentId){
        let res = await this.hashList.getHash(parentId, 'downs');
        return res !== null ? res : 0;
    }

    async getVoteType(parentId, userAuthenticated){

        let userId = userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        let voteType =  await this.hashList.getHash(parentId, userId);
        if (voteType === null) voteType = VoteType.VOTE_NONE;

        voteType = parseInt(voteType);

        return voteType;
    }

    async getVotesWithOnlyUserVote(parentId,  userAuthenticated){
        if (userAuthenticated !== null){
            let userId = userAuthenticated;
            if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

            let voteType =  await this.getVoteType(parentId, userAuthenticated);
            return [{userId: userId, voteType: voteType}];
        }

        return [];
    }





    async changeVoteValue (parentId, previousVoteType, voteType, bDelete){

        let downValue = 0;
        let upValue = 0;

        if ((previousVoteType !== null)&&(previousVoteType !== voteType))
            switch (previousVoteType){
                case VoteType.VOTE_DOWN:
                    downValue += -1;
                    break;
                case VoteType.VOTE_UP:
                    upValue += -1;
                    break;
            }

        if (previousVoteType !== voteType)
            switch (voteType){
                case VoteType.VOTE_DOWN:
                    downValue += 1;
                    break;
                case VoteType.VOTE_UP:
                    upValue += 1;
                    break;
            }

        let StatisticsHelper = require ('../../statistics/helpers/Statistics.helper.js');

        if (downValue !== 0) {
            await this.hashList.incrementBy(parentId, 'downs', downValue);

            await StatisticsHelper.keepParentsStatisticsUpdated('', await this.hashList.getHash(parentId,'parents'), true, StatisticsHelper.updateTotalVoteDownsCounter.bind(StatisticsHelper), downValue, bDelete);
        }
        if (upValue !== 0) {
            await this.hashList.incrementBy(parentId, 'ups', upValue);

            await StatisticsHelper.keepParentsStatisticsUpdated('', await this.hashList.getHash(parentId,'parents'), true, StatisticsHelper.updateTotalVoteUpsCounter.bind(StatisticsHelper), upValue, bDelete);
        }

    }


};


module.exports = new VotingInfoHashList();