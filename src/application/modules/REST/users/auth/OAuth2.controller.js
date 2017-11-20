/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/14/2017.
 * (C) BIT TECHNOLOGIES
 */

import constants from 'bin/constants'

let UsersHelper =  require('./helpers/Users.helper.js');
let UserHelper =  require('./helpers/User.helper.js');

// import {Users} from './helpers/Users.model.js';
// import {UserHelper} from './helpers/User.helper.js';

module.exports = {


    async registerOAuth2(req, sSocialNetwork, sOAuth2Token, sSocialNetworkUserId, arrSocialNetworkData){

        let res = await this.validateOAuth2TokenAsync(sSocialNetwork, sOAuth2Token, sSocialNetworkUserId, arrSocialNetworkData);

        if (res == true) {

            //checking if the user has been registered before already...
            let user = await UsersHelper.findUserFromSocialNetwork(sSocialNetwork, sSocialNetworkUserId);

            if (user !== null)
                console.log('User found in the DB');

            //console.log('User already in the DB: ',user);

            if (user !== null) {

                UsersHelper.updateLastActivity(user);

                return ({
                    result: true,
                    type: "log in",
                    user: user.getPublicInformation(user),
                    sessionId: await UserHelper.createAuthSession(user),
                });
            } else {//registering the new user

                //I create a special property OAuth to show that there is an OAuth registration
                var OAuth = {
                    socialNetwork: sSocialNetwork,
                    socialNetworkUserId: sSocialNetworkUserId,
                    socialNetworkData : arrSocialNetworkData,
                    accessToken: sOAuth2Token
                };

                console.log(req.body);


                UserHelper.generateUserName(req.body.firstName || '', req.body.lastName || '', req.body.email || '').then((userName) => {

                    req.body.username = userName;
                    console.log('Username generated: ', userName);

                    var Authenticate = require('./Authenticate.controller.js');
                    return (Authenticate.postAuthenticateRegister(req, res, OAuth));

                });

            }

            console.log('OAUTH validated successfully');
        }
    },

    validateOAuth2TokenAsync(sOAuth2SocialNetworkName, sOauth2Token, sSocialNetworkUserId, arrSocialNetworkData){

        try {

            var options = {
                uri: '',
                headers: {'User-Agent': 'Request-Promise'},
                json: true // Automatically parses the JSON string in the response
            };

            return new Promise( (resolve)=> {


                switch (sOAuth2SocialNetworkName){

                    case 'facebook':

                        //console.log('Validating Facebook TOken....');

                        options.uri = 'https://graph.facebook.com/me?access_token='+sOauth2Token;
                        requestPromise(options).promise().bind(this).then(function (res) {

                            if (res.hasOwnProperty('id')){

                                if (res.id === sSocialNetworkUserId) {
                                    resolve(true);
                                }

                            } else

                                console.log("OAUTH invalid facebook TOKEN ", res);

                            resolve(false);

                        });

                        //data = jwt.verify(sOauth2Token, constants.OAUTH2_FACEBOOK_SECRET);

                        break;

                    case 'google' :
                        break;

                    case 'twitter' :
                        break;
                }

            });

        } catch (Exception){

            console.log('Token is not invalidated' , Exception);

        }

    },

}


