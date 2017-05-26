/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/14/2017.
 * (C) BIT TECHNOLOGIES
 */

var UsersHelper =  require('./helpers/Users.heper.ts');
var UserHelper =  require('./helpers/User.helper.ts');

// import {Users} from './helpers/Users.model.ts';
// import {UserHelper} from './helpers/User.helper.ts';

module.exports = {


    registerOAuth2(req, sSocialNetwork, sOAuth2Token, sSocialNetworkUserId){

        return new Promise( (resolve)=> {


            this.validateOAuth2TokenAsync(sSocialNetwork, sOAuth2Token, sSocialNetworkUserId).then ((res)=> {

                if (res == true) {

                    //checking if the user has been registered before already...
                    UsersHelper.findUserFromSocialNetwork(sSocialNetwork, sSocialNetworkUserId).then ((user)=> {

                        if (user !== null)
                            console.log('User found in the DB');

                        //console.log('User already in the DB: ',user);

                        if (user !== null){

                            UsersHelper.updateLastActivity(user);

                            resolve({
                                result : "true",
                                type : "log in",
                                user : user.getPrivateInformation(),
                                token: UserHelper.getUserToken(user),
                            });
                        } else
                        {//registering the new user

                            //I create a special property OAuth to show that there is an OAuth registration
                            var OAuth = {
                                socialNetwork : sSocialNetwork,
                                socialNetworkUserId : sSocialNetworkUserId,
                                accessToken : sOAuth2Token
                            };

                            console.log(req.body);



                            UserHelper.generateUserName(req.body.firstName||'', req.body.lastName||'', req.body.email||'').then((userName) => {

                                req.body.username = userName;
                                console.log('Username generated: ',userName);

                                var Authenticate = require ('./Authenticate.controller.ts');
                                resolve(Authenticate.postAuthenticateRegister(req, res, OAuth));

                            });

                        }

                        console.log('OAUTH validated successfully');
                    });
                }



            });


        });
    },

    validateOAuth2TokenAsync(sOAuth2SocialNetworkName, sOauth2Token, sSocialNetworkUserId){

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

    },

}


