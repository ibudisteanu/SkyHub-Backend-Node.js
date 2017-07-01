/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */


var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var commonFunctions = require ('../../helpers/common-functions.helper.ts');
var nohmIterator = require ('../../../../DB/Redis/nohm/nohm.iterator.ts');

var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var commonFunctions = require ('../../helpers/common-functions.helper.ts');

const VoteType = {
    VOTE_UP: 1,
    VOTE_DOWN: -1,
    VOTE_NONE: 666,
};

class VotingHash {

    //sortedList
    constructor(){
        this.hashList = new HashList("Voting");
    }

    async addVoteValue (parentId, voteType){

        let value = 0;
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

    async addVote (parentId, authenticatedUser, voteType ){

        if ((typeof authenticatedUser === "undefined")||(authenticatedUser === null)) return {result: false, message: 'Authenticated User is not defined'};

        let userId = authenticatedUser;
        if (typeof authenticatedUser === 'object') userId = authenticatedUser.id||'';

        if (userId === '') return {result: false, message: 'Authenticated User is not defined'};

        let foundVoteType = await this.hashList.getHash(parentId, userId) ;

        if ( foundVoteType === null){

            if (foundVoteType !== VoteType.VOTE_NONE )
                await this.addVoteValue(parentId, - foundVoteType)

        }

        await this.hashList.setHash(parentId, userId, voteType);
        await this.addVoteValue(parentId, voteType);

        return {
            result: true,
            vote:{
                value: await this.getVoteValue(parentId),
                voteType: voteType,
            }
        };

    }

    //NOT FINISHED
    async getAllVotes(parentId, authenticatedUser){

        //verific daca authenticatedUser is owner of the parentId

        let hashRests = await this.hashList.getAllHash(parentId);

        let result = [];

        let i = 0;
        while (i < hashRests.length){
            let userId = hashRests[i];
            let voteType = hashRests[i+1];

            result.push({
                userId: userId,
                voteType: voteType,
            });

            i+=2;
        }

        return result;

    }

    getVoteValue(parentId){
        return this.hashList.getHash(parentId, 'value');
    }

    async getVote (parentId, authenticatedUser){

        if (typeof authenticatedUser === "undefined") authenticatedUser = null;

        let value =  await this.getVoteValue(parentId);
        let voteType = VoteType.VOTE_NONE;
        if (value === null) value = 0;

        if (authenticatedUser !== null){

            let userId = authenticatedUser;
            if (typeof authenticatedUser === 'object') userId = authenticatedUser.id;

            voteType = await this.hashList.getHash(parentId, userId);
            if (voteType === null) voteType = VoteType.VOTE_NONE;

        }

        return {
            result:true,
            vote: {
                value: value,
                userVoteType: voteType,
                parentId: parentId,
                votes: [],
            }
        }

    }

    async test(){

        console.log("addVote", await this.addVote('parent1', {id: 22}, VoteType.VOTE_UP ));
        console.log("addVote", await this.addVote('parent1', {id: 24}, VoteType.VOTE_UP ));
        console.log("addVote", await this.addVote('parent1', {id: 26}, VoteType.VOTE_DOWN ));
        console.log("getVote", await this.getVote('parent1') );
        console.log("addVote", await this.addVote('parent1', {id: 26}, VoteType.VOTE_UP ));
        console.log("getVote", await this.getVote('parent1') );

    }

};


module.exports = new VotingHash();