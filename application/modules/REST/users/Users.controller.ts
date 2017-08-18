/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

var UsersHelper = require ('./auth/helpers/Users.helper.ts');
var AuthenticatingUser = require('./auth/helpers/AuthenticatingUser.helper.ts');
var ContentHelper = require ('./../forums/content/helpers/Content.helper.ts');

module.exports = {
    /*
     REST API
     */
    async postGetUser (req, res){

        let userId = '';

        if (req.hasOwnProperty('body')){

            userId = req.body.userId || '';
        }

        if (userId.length < 3)
            return {result:false, message:"To few letters in the AuthorId"};

        let user = await UsersHelper.findUserById(userId);

        return {result:true, userId: userId, user:user.getPublicInformation(null)}

    },

    async postSetProfilePic (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let userId = '', profilePic = '';

        if (req.hasOwnProperty('body')){

            userId = req.body.userId || '';
            profilePic = req.body.profilePic || '';
        }

        if (userId.length < 3)
            return {result:false, message:"To few letters"};

        let answer = await ContentHelper.setIcon(userAuthenticated, userId, profilePic);
        answer.userId = userId;
        return answer;

    }

}