/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

var VotingHelper = require('./helpers/Votings.helper.js');
var VoteType = require ('./models/VoteType.js');

var AuthenticatingUser = require('../users/auth/helpers/AuthenticatingUser.helper.ts');

module.exports = {

    /*
     REST API
     */

    async postSubmitVote (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let parentId = '';
        let voteType = VoteType.VOTE_NONE;

        if (req.hasOwnProperty('body')) {
            parentId = req.body.parentId || '';
            voteType = req.body.voteType || VoteType.VOTE_NONE;
        }

        return await VotingHelper.submitVote(parentId, userAuthenticated, voteType);

    },

    async postGetVote (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);
        let parentId = '';

        if (req.hasOwnProperty('body'))
            parentId = req.body.parentId || '';

        return await VotingHelper.getVote(parentId, userAuthenticated);

    },

    async postGetAllVotes (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);
        let parentId = '';

        if (req.hasOwnProperty('body'))
            parentId = req.body.parentId || '';

        return await VotingHelper.getVote(parentId, userAuthenticated, true);

    },

}