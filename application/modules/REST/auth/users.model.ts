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

    registerUser : function (sEmail, sUsername, sPassword, sFirstName, sLastName, sCountry, sCity, sLanguage, sProfilePic, sCoverPic){

        if (typeof sCountry === 'undefined') sCountry = '';
        if (typeof sCity === 'undefined') sCity = '';
        if (typeof sLanguage === 'undefined') sLanguage = sCountry;
        if (typeof sProfilePic === 'undefined') sProfilePic = '';
        if (typeof sCoverPic === 'undefined') sCoverPic = '';

        var user = redis.nohm.factory('UserModel');

        user.p(
            {
                username: sUsername,
                email: sEmail,
                password: sPassword,
                profilePic: sProfilePic,
                coverPic: sCoverPic,
                firstName: sFirstName,
                lastName: sLastName,
                country: sCountry.toLowerCase(),
                city: sCity.toLowerCase(),
                language: sLanguage.toLowerCase(),
                dtCreation: new Date(),
                dtLastActivity: new Date(),
            }
        );

        return new Promise( (resolve)=> {

            user.save(function (err) {
                if (err) {
                    console.log("==> Error Saving User");
                    console.log(user.errors); // the errors in validation

                    resolve({success:false, errors: user.errors });
                } else {
                    console.log("Saving User Successfully");
                    resolve( {success:true, result: user });
                }
            });

        });
    },

    findUserFromEmailUsernamePassword : function (sEmailUsername, sPassword){
        console.log("Checking user password ::: " + sEmailUsername + " ::: " + sPassword);

        return new Promise ((resolve) => {

            this.findUserFromEmailUsername(sEmailUsername).then ((foundUser )=> {

                //checking the stored Hash is the same with the input password
                if (foundUser === null) resolve (null);
                else {

                    /*
                     console.log(foundUser);
                     console.log(foundUser.p('password'));
                     */

                    this.passwordHashVerify(sPassword, foundUser.p('password')).then((answerPassword) => {
                        if (answerPassword === true)
                            resolve(foundUser);
                        else
                            resolve(null);
                    });
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
                    this.findUserFromEmailUsername(sEmailUsername).then ( (userFound) => {

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

    passwordHashVerify : function (sPassword, sPasswordHash) {

        if (typeof sPasswordHash === "undefined") sPasswordHash = '$2y$08$9TTThrthZhTOcoHELRjuN.3mJd2iKYIeNlV/CYJUWWRnDfRRw6fD2';
        if (typeof sPassword === "undefined") sPassword = "secret";

        var bcrypt = require('bcrypt');
        sPasswordHash = sPasswordHash.replace(/^\$2y(.+)$/i, '\$2a$1');

        return new Promise ((resolve) => {
            bcrypt.compare(sPassword, sPasswordHash, function(err, res) {

                console.log("PASSWORD HASH VERIFY answer");
                console.log(res);

                resolve(res);

            });
        });
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
