/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/14/2017.
 * (C) BIT TECHNOLOGIES
 */

constants = require ('./../../../../bin/constants.js');
var Promise = require('promise');


var options = {
    uri: '',
    headers: {'User-Agent': 'Request-Promise'},
    json: true // Automatically parses the JSON string in the response
};


module.exports = {

    validateOAuth2TokenAsync: function (sOAuth2SocialNetworkName, sOauth2Token, sSocialNetworkUserId){

        try {

            return new Promise( (resolve)=> {


                    switch (sOAuth2SocialNetworkName){

                        case 'facebook':

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

                            //data = jwt.verify(sOauth2Token, constants.OAUTH2_Facebook_Secret);

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

    }
}