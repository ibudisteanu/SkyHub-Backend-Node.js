/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

var VotingsHashList = require('./helpers/Votings.hashlist.js');
var VoteType = require ('./models/VoteType.js');

import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

module.exports = {

    /*
     REST API
     */

    async postSubmitVote (req, res){

        let parentId = '';
        let voteType = VoteType.VOTE_NONE;

        if (req.hasOwnProperty('body')) {
            parentId = req.body.parentId || '';
            voteType = req.body.voteType || VoteType.VOTE_NONE;
        }

        return await VotingsHashList.submitVote(parentId, req.userAuthenticated, voteType);

    },

    async postGetVote (req, res){

        let parentId = '';

        if (req.hasOwnProperty('body'))
            parentId = req.body.parentId || '';

        return await VotingsHashList.getVote(parentId, req.userAuthenticated);

    },

    async postGetAllVotes (req, res){

        let parentId = '';

        if (req.hasOwnProperty('body'))
            parentId = req.body.parentId || '';

        return await VotingsHashList.getVote(parentId, req.userAuthenticated, true);

    },

}