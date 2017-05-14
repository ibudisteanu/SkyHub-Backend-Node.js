var redis = require ('../../DB/redis_nohm');
var userModel = require ('./user.model.ts');
var Promise = require('promise');


module.exports = {

    createDummyUser : function(iIndex)
    {
        return this.registerUser("emailDummy_"+iIndex+"@yahoo.com","userDummy_"+iIndex, "123456","Gigel",
            "Nume"+iIndex,"RO","Bucharest", "RO", "http://www.gravatar.com/avatar/ee4d1b570eff6ce63"+iIndex+"?default=wavatar&forcedefault=1",
            "http://www.hdfbcover.com/randomcovers/covers/never-stop-dreaming-quote-fb-cover.jpg");
    },

    findUserById : function (sId)
    {
        return new Promise( (resolve)=> {

            if ((typeof sId === 'undefined') || (sId == []) || (sId === null)) {
                resolve(null);
                return null;
            }

            //console.log('finding user '+sId);

            var user = redis.nohm.factory('UserModel', sId, function (err) {
                if (err)  // db error or id not found
                    resolve (null);
                else
                    resolve (user);
            });

        });
    },

    /*
        REGISTRATION USER
            using string password => hashed
            using social network
     */
    registerUser : function (sEmail, sUsername, password, sFirstName, sLastName, sCountry, sCity, sLanguage, sProfilePic, sCoverPic, dbLatitude, dbLongitude, iAge, sTimeZone, sGender){

        sCountry = sCountry || ''; sCity = sCity || ''; sProfilePic = sProfilePic || ''; sCoverPic = sCoverPic || '';
        dbLatitude = dbLatitude || -666; dbLongitude = dbLongitude || -666; iAge = iAge || 0; sTimeZone = sTimeZone || ''; sGender = sGender || '';

        sLanguage = sLanguage || sCountry;

        sUsername = sUsername.toLowerCase();


        var user = redis.nohm.factory('UserModel');
        var errorValidation = {};

        //if (! /^[^`<>[\]'"\s~!@#%^&*()|\\?,.:{}=+\xA6-\xDF\x00-\x20\x7F\xF0-\xFF]+$/g.test(sUsername)){
        if (! /^(?=.{4,30}$)(?![_.-])(?!.*[_.$-]{2})[a-zA-Z0-9._$-]+$/g.test(sUsername)){
            errorValidation.username = ["Invalid Username"];
        }

        if (typeof (password) === 'string') //it is a simple password
            user.p('password', this.passwordHash(password));
        else {
            let sSocialNetwork = password.socialNetwork;
            let sSocialNetworkUserId = password.socialNetworkUserId;
            let sOAuth2Token = password.accessToken;

            switch (sSocialNetwork){
                case 'facebook':
                    user.p('idFacebook', sSocialNetworkUserId);
                    break;

                case 'google':
                    user.p('idGoogle', sSocialNetworkUserId);
                    break;

                case 'twitter':
                    user.p('idGoogle', sSocialNetworkUserId);
                    break;

                case 'linkedin':
                    user.p('idLinkedIn', sSocialNetworkUserId);
                    break;

                case 'reddit':
                    user.p('idReddit', sSocialNetworkUserId);
                    break;
            }

        }

        user.p(
            {
                username: sUsername,
                email: sEmail,
                profilePic: sProfilePic,
                coverPic: sCoverPic,
                firstName: sFirstName,
                lastName: sLastName,
                country: sCountry.toLowerCase(),
                city: sCity.toLowerCase(),
                language: sLanguage.toLowerCase(),
                dtCreation: new Date(),
                dtLastActivity: new Date(),
                age : iAge,
                gender : sGender,
                timeZone : sTimeZone
            }
        );

        if (dbLatitude != -666) user.p('latitude', dbLatitude);
        if (dbLongitude != -666) user.p('longitude', dbLongitude);

        return new Promise( (resolve)=> {

            if (Object.keys(errorValidation).length !== 0 ){

                resolve({result: "false", errors: errorValidation});

                return;
            }

            user.save(function (err) {
                if (err) {
                    console.log("==> Error Saving User");
                    console.log(user.errors); // the errors in validation

                    resolve({result:"false", errors: user.errors });
                } else {
                    console.log("Saving User Successfully");
                    console.log(user.getPrivateInformation());

                    resolve( {result:"true", user: user.getPrivateInformation() });
                }
            });

        });
    },

    findUserFromEmailUsernamePassword : function (sEmailUsername, sPassword){
        console.log("Checking user password ::: " + sEmailUsername + " ::: " + sPassword);

        return new Promise ((resolve) => {

            this.findUserFromEmailUsername(sEmailUsername).then ((foundUser )=> {

                //checking the stored Hash is the same with the input password
                if (foundUser === null) resolve ({result:"false", message: "No User Found"});
                else {

                    /*
                     console.log(foundUser);
                     console.log(foundUser.p('password'));
                     */

                    if (this.passwordHashVerify(sPassword, foundUser.p('password')))
                        resolve({result:"true", user: foundUser});
                    else
                        resolve({result:"false", message: "Password Incorrect"});

                }

            });

        });

    },

    findUserFromEmailUsername : function (sEmailUsername){
        console.log("Finding user :::  " + sEmailUsername);

        return new Promise((resolve) =>{
            this.findUserFromEmail(sEmailUsername).then ( (userFound) => {

                //console.log('USER FOUND'); console.log(userFound);
                //console.log('answer from email....'); console.log(res);

                if (userFound != null) resolve (userFound);
                else
                    this.findUserFromUsername(sEmailUsername).then ( (userFound) => {

                        resolve (userFound);
                    })
            });
        });
    },

    findUserFromUsername: function (sUsername){
        var user = redis.nohm.factory('UserModel');

        //console.log('Checking user by username ' + sUsername);

        return new Promise ((resolve)=>{
            //find by username
            user.findAndLoad({
                username: sUsername,
            }, function (err, users) {
                //console.log("response from username"); console.log(users);

                if (users.length) resolve(users[0]);
                else resolve(null);
            });
        });
    },

    findUserFromEmail : function (sEmail){
        var user = redis.nohm.factory('UserModel');

        console.log('Checking user by email ::: ' + sEmail);

        return new Promise ((resolve)=>{
            //find by username

            user.findAndLoad({
                email: sEmail,
            }, function (err, users) {
                //console.log("response from useremail "); console.log(users);

                if (users.length) resolve(users[0]);
                else resolve (null);
            });
        });
    },

    findUserFromSocialNetwork: function (sSocialNetwork, sId){
        var user = redis.nohm.factory('UserModel');

        console.log('Checking user by social network ',sSocialNetwork,'  id ' + sId);

        var searchObject = {};

        if (sSocialNetwork === 'facebook') searchObject = {idFacebook : sId};
        if (sSocialNetwork === 'google') searchObject = {idGoogle : sId};
        if (sSocialNetwork === 'twitter') searchObject = {idTwitter : sId};
        if (sSocialNetwork === 'linkedin') searchObject = {idLinkedIn : sId};
        if (sSocialNetwork === 'reddit') searchObject = {idReddit : sId};

        console.log('searching for: ',searchObject);

        return new Promise ((resolve)=>{
            //find by username
            user.findAndLoad( searchObject, function (err, users) {
                //console.log("response from username"); console.log(users);

                if (users.length) resolve(users[0]);
                else resolve(null);
            });
        });
    },


    passwordHashVerify : function (sPassword, sPasswordHash) {

        if (typeof sPasswordHash === "undefined") sPasswordHash = '$2y$08$9TTThrthZhTOcoHELRjuN.3mJd2iKYIeNlV/CYJUWWRnDfRRw6fD2';
        if (typeof sPassword === "undefined") sPassword = "secret";

        var bcrypt = require('bcrypt');
        sPasswordHash = sPasswordHash.replace(/^\$2y(.+)$/i, '\$2a$1');

        return bcrypt.compareSync(sPassword, sPasswordHash);
    },

    passwordHash : function (sPassword){

        var bcrypt = require('bcrypt');
        return bcrypt.hashSync(sPassword, 8);
    },

    updateLastActivity: function (Users){ //making the user online

        if (!Users.isArray)
            Users = [Users];

        console.log('updating last activity');

        Users.forEach( function(userIterator, index){
            var user = userIterator;

            if (typeof user === 'string'){
                user = this.findUserById(user);
            }

            user.p('dtLastActivity',new Date().toISOString());

            user.save( function (err) {

                    if (err) {
                        console.log('Error updating last login');
                        console.log(err);
                    }
                });
        })


    }

};
