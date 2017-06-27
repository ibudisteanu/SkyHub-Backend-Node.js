var UserHelper = require('./helpers/User.helper.ts');
var UsersHelper = require('./helpers/Users.helper.ts');

var AuthenticatingUser = require('./helpers/AuthenticatingUser.helper.ts');

var OAuth2 = require('./OAuth2.controller.ts');

//import {UserHelper} from './helpers/user.helper.ts'
//import {Users} from './helpers/Users.model.ts';
//import {OAuth2} from './oauth2.controller.ts';

module.exports = {

     /*
        REST API
     */

    async postAuthenticateLogin (req, res){

        var sEmailUsername = '', sUserPassword = '';

        if (req.hasOwnProperty('body')){

            sEmailUsername = typeof req.body.emailUsername !== 'undefined' ? req.body.emailUsername : '';
            sUserPassword = typeof req.body.password !== 'undefined' ? req.body.password : '';
        }

        console.log(sEmailUsername);
        console.log(sUserPassword);


        let answer = await UsersHelper.findUserFromEmailUsernamePassword(sEmailUsername, sUserPassword);

        // passport.authenticate('local','','', function (req, res){
        //
        // });

        console.log('User answer',answer);

        if (answer.result === true)
        {
            //console.log(loggedInUser.getFullName());
            //console.log(loggedInUser.getPublicInformation());

            UsersHelper.updateLastActivity(answer.user);

            return ( {
                result: true,
                message: 'Welcome back, '+answer.user.getFullName(),
                user :  answer.user.getPublicInformation(),
                sessionId: await UserHelper.createAuthSession(answer.user),
            });

        } else
            return ({
                result: false,
                message: answer.message,
            });


    },


    async postAuthenticateSession(req, res){

        let authenticatedUser = await AuthenticatingUser.loginUser(req);

        if (authenticatedUser === null){
            return {
                result: false,
                message: "Error. Invalid Session",
            }
        } else
            return {
                result: true,
                user: authenticatedUser.getPublicInformation(),
            };

    },


    postAuthenticateRegister(req, res, OAuth){

        var sEmail = '', sUsername = '', password = {type: "string", value: ""}, sFirstName = '', sLastName = '', sLastName='', sCountry='', sCity='',sLanguage='', sProfilePic='', sCoverPic='';
        var dbLatitude = 0, dbLongitude = 0, iAge = 0, iTimeZone = 0, sGender = 0, bVerified = false;  var sShortBio = '';

        if (req.hasOwnProperty('body')){
            sEmail = req.body.email || '';
            sUsername = req.body.username ||  '';
            password = {
                type: "string",
                value: req.body.password || '',
            };
            sFirstName = req.body.firstName ||  '';
            sLastName = req.body.lastName ||  '';
            sCountry = req.body.country || '';
            sCity = req.body.city || '';

            dbLatitude = req.body.latitude || -666;
            dbLongitude = req.body.longitude || -666;

            sLanguage = req.body.language || sCountry;
            iAge = req.body.age || 0;
            iTimeZone = req.body.timeZone || 0;
            sGender = sGender || '';

            sProfilePic = req.body.profilePic || '';
            sCoverPic = req.body.coverPic || '';

            sShortBio = req.body.shortBio || '';
        }

        if (typeof OAuth !== "undefined"){
            password = {
                type: "oauth2",
                value: OAuth,
            };
            bVerified = req.body.verified || false;
        }

        // if (req.hasOwnProperty(('OAuth'))){
        //     password = {
        //         type: "oauth2",
        //         value: req.OAuth,
        //     };
        //
        //     bVerified = req.body.verified || false;
        // }

        console.log('Registering: ', sEmail);

        return UsersHelper.registerUser(sEmail, sUsername, password, sFirstName, sLastName, sCountry, sCity, sLanguage, sProfilePic, sCoverPic, dbLatitude, dbLongitude, sShortBio,  iAge, iTimeZone, sGender, bVerified);
    },


    async postAuthenticateRegisterOAuth(req, res){

        var sSocialNetwork='', sOAuth2Token = '', sSocialNetworkUserId = '';

        if (req.hasOwnProperty('body')){
            sSocialNetwork = req.body.socialNetwork || '';
            sSocialNetworkUserId = req.body.socialNetworkId || '';
            sOAuth2Token = req.body.accessToken || '';
        }

        console.log('Registering with OAuth 2 token ',sSocialNetwork, sOAuth2Token, sSocialNetworkUserId);

        return OAuth2.registerOAuth2(req, sSocialNetwork, sOAuth2Token, sSocialNetworkUserId);
    },


    async logout(req){
        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        if (userAuthenticated !== null){
            let sSessionId = AuthenticatingUser.getSessionId(req);
            var SessionHashHelper = require ('./sessions/helpers/SessionHash.helper');
            let result = await SessionHashHelper.deleteSession(sSessionId, userAuthenticated);

            if (result === true)
                return { result:true };

        }

        return {result:false};
    }

}

