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

    getVoteValue(parentId){
        return this.hashList.getHash(parentId, 'value');
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





    async changeVoteValue (parentId, voteType){

        let value = voteType;

        switch (voteType){

            case VoteType.VOTE_UP:
                value = 1;
                break;
            case VoteType.VOTE_DOWN:
                value = -1;
                break;
            default:
                value = 0;
                break;
        }

        return await this.hashList.incrementBy(parentId,'value', value );

    }


};


module.exports = new VotingHelper();