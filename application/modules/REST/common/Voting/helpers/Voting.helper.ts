/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */


var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var commonFunctions = require ('../../helpers/common-functions.helper.ts');
var nohmIterator = require ('../../../../DB/Redis/nohm/nohm.iterator.ts');

var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var commonFunctions = require ('../../helpers/common-functions.helper.ts');
var VoteType = require ('./../models/VoteType.js');

class VotingHash {

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

        let voteType = await this.hashList.getHash(parentId, userId);
        if (voteType === null) voteType = VoteType.VOTE_NONE;

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

    async submitVote (parentId, userAuthenticated, voteType ){

        if ((typeof userAuthenticated === "undefined")||(userAuthenticated === null)) return {result: false, message: 'Authenticated User is not defined'};

        let userId = userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id||'';

        if (userId === '') return {result: false, message: 'Authenticated User is not defined'};

        let foundVoteType = await this.hashList.getHash(parentId, userId) ;

        if ( foundVoteType !== null){

            if (foundVoteType !== VoteType.VOTE_NONE )
                await this.changeVoteValue(parentId, - foundVoteType)

        }

        await this.hashList.setHash(parentId, userId, voteType);
        await this.changeVoteValue(parentId, voteType);

        return {
            result: true,
            vote:{
                value: await this.getVoteValue(parentId),
                parentId: parentId,
                votes: await this.getVotesWithOnlyUserVote(parentId, userAuthenticated),
            }
        };

    }

    //NOT FINISHED
    async getAllVotes(parentId, userAuthenticated){

        //verific daca userAuthenticated is owner of the parentId
        let userAuthenticatedId = userAuthenticated;
        if (typeof userAuthenticated === 'object') userAuthenticatedId = userAuthenticated.id;

        let hashRests = await this.hashList.getAllHash(parentId);

        let result = [];

        let i = 0;
        while (i < hashRests.length){
            let userId = hashRests[i];
            let voteType = hashRests[i+1];

            if ((voteType === VoteType.VOTE_UP)||(userId === userAuthenticatedId))
                result.push({
                    userId: userId,
                    voteType: voteType,
                });

            i+=2;
        }

        return result;

    }



    async getVote (parentId, userAuthenticated){

        if (typeof userAuthenticated === "undefined") userAuthenticated = null;

        let value =  await this.getVoteValue(parentId);
        if (value === null) value = 0;

        return {
            result:true,
            vote: {
                value: value,
                parentId: parentId,
                votes: await this.getVotesWithOnlyUserVote(parentId, userAuthenticated),
            }
        }

    }

    async test(){

        console.log("submitVote", await this.submitVote('parent1', {id: 22}, VoteType.VOTE_UP ));
        console.log("submitVote", await this.submitVote('parent1', {id: 24}, VoteType.VOTE_UP ));
        console.log("submitVote", await this.submitVote('parent1', {id: 26}, VoteType.VOTE_DOWN ));
        console.log("getVote", await this.getVote('parent1') );
        console.log("submitVote", await this.submitVote('parent1', {id: 26}, VoteType.VOTE_UP ));
        console.log("getVote", await this.getVote('parent1') );

    }

};


module.exports = new VotingHash();