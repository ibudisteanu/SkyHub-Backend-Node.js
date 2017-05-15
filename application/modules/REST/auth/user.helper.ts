/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/15/2017.
 * (C) BIT TECHNOLOGIES
 */

var users = require('./users.model.ts');

module.exports = {
    /*
     HELPER FUNCTIONS
     */

    //generate a unique username from firstName, lastName, emailAddress and a unique random number [10 trials]
    generateUserName : function (sFirstName, sLastName, sEmail){

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

        //generating Random User
        function nextRandomUser(sUserNamePrefix, iCount){

            return new Promise ( (resolve) => {

                if (iCount <= 0) resolve( sUserNamePrefix + 'aaa' );
                else{
                    var sFinalUserName = sUserNamePrefix + Math.floor(Math.random() * randomGeneratorNumber);

                    users.findUserFromUsername(sFinalUserName).then ((user)=>{

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
            users.findUserFromUsername(sFinalUserName).then ( (user)=>{

                if (user === null) resolve(sFinalUserName);
                else  nextRandomUser(sUserNamePrefix, 20).then ( (userNameFinal) =>{
                    resolve(userNameFinal);
                });

            });

        });
    },

    generateAuthTokenId : function()
    {
        var hat = require('hat');
        return hat();
    },

    getUserToken : function(user){

        //console.log('calculating token');

        constants = require ('./../../../../bin/constants.js');
        console.log("SECRET key: "+constants.SESSION_Secret_key);

        var token = jwt.sign({ "id" : user.id}, constants.SESSION_Secret_key, {expiresInMinutes: 60 * 24 * 30* 12 * 5});
        console.log('token = '+token);

        return token;
    }
};