/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/2/2017.
 * (C) BIT TECHNOLOGIES
 */


var HashList = require ('../../../DB/Redis/lists/HashList.helper.ts');

var VoteType = require ('../models/VoteType.js');

class VotingHelper {

    //sortedList
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





    async changeVoteValue (parentId, previousVoteType, voteType){

        let value = voteType;

        if ((previousVoteType !== null)&&(previousVoteType !== voteType)){


            switch (previousVoteType){
                case VoteType.VOTE_DOWN:
                    await this.hashList.incrementBy(parentId, 'downs', -1);
                    break;
                case VoteType.VOTE_UP:
                    await this.hashList.incrementBy(parentId, 'ups', -1);
                    break;
            }
        }

        switch (voteType){
            case VoteType.VOTE_DOWN:
                return await this.hashList.incrementBy(parentId, 'downs', +1);
            case VoteType.VOTE_UP:
                return await this.hashList.incrementBy(parentId, 'ups', +1);
        }

    }


};


module.exports = new VotingHelper();