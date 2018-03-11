/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import UsersHelper from 'REST/users/auth/helpers/Users.helper'
import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper'
import ContentHelper from 'REST/forums/content/helpers/Content.helper.js'

export default {
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

        let userId = '', profilePic = '';

        if (req.hasOwnProperty('body')){

            userId = req.body.userId || '';
            profilePic = req.body.profilePic || '';
        }

        if (userId.length < 3)
            return {result:false, message:"To few letters"};

        let answer = await ContentHelper.setIcon(req.userAuthenticated, userId, profilePic);
        answer.userId = userId;
        return answer;

    }

}