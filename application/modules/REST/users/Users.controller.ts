/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

var UsersHelper = require ('./auth/helpers/Users.helper.ts');

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
            return {result:false, message:"To few letters"};

        let user = await UsersHelper.findUserById(userId);

        return {result:true, userId: userId, user:user.getPublicInformation(null)}

    }
}