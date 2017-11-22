/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/15/2017.
 * (C) BIT TECHNOLOGIES
 */

import constants from 'bin/constants';
import UsersHelper from 'REST/users/auth/helpers/Users.helper'
var nohmValidation = require ('DB/Redis/nohm/nohm.validation.js');
import CommonFunctions from 'REST/common/helpers/CommonFunctions.helper.js'

class UserHelper {
    /*
     HELPER FUNCTIONS
     */


    //generate a unique username from firstName, lastName, emailAddress and a unique random number [10 trials]
     generateUserName (sFirstName, sLastName, sEmail){

        var randomGeneratorNumber = 2020;
        var sUserNamePrefix = (sFirstName !== "" ? sFirstName+'_' : '')+sLastName; //first from firstName and lastName

        if (sUserNamePrefix === '') {
            var nameEmail = sEmail.replace(/@.*$/,""); //extracting the name from email address ionut@budisteanu.net => ionut
            sUserNamePrefix = nameEmail;
        }

        //In case I failed in everything, the prefix template should be "user999"
        if (sUserNamePrefix === ""){
            sUserNamePrefix = "user";
            randomGeneratorNumber = 100000;
        }

        sUserNamePrefix = CommonFunctions.url_slug(sUserNamePrefix, {'delimiter':'_', 'transliterate':true});
         sUserNamePrefix = nohmValidation.sanitizeUsername(sUserNamePrefix, '_');

        //generating Random User
        function nextRandomUser(sUserNamePrefix, iCount){

            return new Promise ( (resolve) => {

                if (iCount <= 0) resolve( sUserNamePrefix + 'aaa' );
                else{
                    var sFinalUserName = sUserNamePrefix + Math.floor(Math.random() * randomGeneratorNumber);

                    UsersHelper.findUserFromUsername(sFinalUserName).then ((user)=>{

                        if (user === null) resolve (sFinalUserName);
                        else
                            nextRandomUser(sUserNamePrefix, iCount--).then ((finalAnswer)=>{
                                resolve(finalAnswer);
                            });
                    });
                }

            });
        }

        return new Promise( (resolve)=>{

            var sFinalUserName = sUserNamePrefix;
            UsersHelper.findUserFromUsername(sFinalUserName).then ( (user)=>{

                if (user === null) resolve(sFinalUserName);
                else  nextRandomUser(sUserNamePrefix, 20).then ( (userNameFinal) =>{
                    resolve(userNameFinal);
                });

            });

        });
    }

    async createAuthSession (user)
    {
        var SessionHashHelper = require('../sessions/helpers/SessionHash.helper.js');
        return await SessionHashHelper.createSession(user);
    }


    getUserToken (user){

        console.log('calculating token');
        console.log("SECRET key: "+constants.SESSION_SECRET_KEY);

        //var token = jwt.sign({ "id" : user.id}, constants.SESSION_SECRET_KEY, {expiresInMinutes: 60 * 24 * 30* 12 * 5});
        var token = jwt.sign({ "id" : user.id}, constants.SESSION_SECRET_KEY, {expiresIn: 60 * 24 * 30* 12 * 5});
        console.log('token = '+token);

        return token;
    }

}

export default new UserHelper()