var userModel = require ('./../models/User.model.ts');
var UserProperties = require ('./../models/User.properties.ts');

module.exports = {

    createDummyUser (iIndex){

        return this.registerUser("emailDummy_"+iIndex+"@yahoo.com","userDummy_"+iIndex, "123456","Gigel",
            "Nume"+iIndex,"RO","Bucharest", "RO", "http://www.gravatar.com/avatar/ee4d1b570eff6ce63"+iIndex+"?default=wavatar&forcedefault=1",
            "http://www.hdfbcover.com/randomcovers/covers/never-stop-dreaming-quote-fb-cover.jpg");
    },

    findUserById (sId){

        return new Promise( (resolve)=> {

            if ((typeof sId === 'undefined') || (sId == []) || (sId === null))
                resolve(null);
            else

            var UserModel = redis.nohm.factory('UserModel', sId, function (err, user) {

                //console.log("********* findUserById: ##"+sId+"##",err, user);

                if (err)  // db error or id not found
                    resolve (null);
                else
                    resolve (UserModel);
            });

        });
    },


    /*
     REGISTRATION USER
     using string password => hashed
     using social network
     */
    async registerUser (sEmail, sUsername, password, sFirstName, sLastName, sCountry, sCity, sLanguage, sProfilePic, sCoverPic, dbLatitude, dbLongitude, sShortBio, iAge, iTimeZone, enGender, bVerified){

        sCountry = sCountry || ''; sCity = sCity || ''; sProfilePic = sProfilePic || ''; sCoverPic = sCoverPic || '';
        dbLatitude = dbLatitude || -666; dbLongitude = dbLongitude || -666; iAge = iAge || 0; iTimeZone = iTimeZone || 0; var bVerified = bVerified || false, sShortBio = sShortBio||'';

        sLanguage = sLanguage || sCountry;

        //console.log('processing gender'); console.log(UserProperties.UserGenderEnum.NOT_SPECIFIED); console.log('calculating');

        enGender = UserProperties.convertGenderString(enGender) || UserProperties.UserGenderEnum.NOT_SPECIFIED;

        sUsername = sUsername.toLowerCase();

        var user = redis.nohm.factory('UserModel');
        var errorValidation = {};

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
                gender : enGender,
                timeZone : iTimeZone,
                verified : bVerified,
                shortBio : sShortBio,
                role : UserProperties.UserRolesEnum.USER,
            }
        );

        if (password.type === 'string'){ //it is a simple password
            user.p('password', this.passwordHash(password.value));

            //also it is required to have an email address
            if (sEmail.length < 3)
                errorValidation.email = ["Email is required"];
            else
            if (! /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(sEmail))
                errorValidation.email = ["Invalid Email"]


        }
        else
        if (password.type === "oauth2") {

            let sSocialNetwork = password.value.socialNetwork;
            let sSocialNetworkUserId = password.value.socialNetworkUserId;
            let sOAuth2Token = password.value.accessToken;

            switch (sSocialNetwork) {
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

    async findUserFromEmailUsernamePassword (sEmailUsername, sPassword){
        console.log("Checking user password ::: " + sEmailUsername + " ::: " + sPassword);

        var foundUser = await this.findUserFromEmailUsername(sEmailUsername);

        return new Promise ((resolve) => {

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

    },

    async findUserFromEmailUsername (sEmailUsername){
        console.log("Finding user :::  " + sEmailUsername);

        var userFound = await this.findUserFromEmail(sEmailUsername);

        return new Promise((resolve) =>{

            //console.log('USER FOUND'); console.log(userFound);
            //console.log('answer from email....'); console.log(res);

            if (userFound != null) resolve (userFound);
            else {
                this.findUserFromUsername(sEmailUsername).then ( (answer) => {
                    resolve( answer ) ;
                });
            }

        });
    },


    async findUserFromUsername(sUsername){
        var UserModel = redis.nohm.factory('UserModel');

        //console.log('Checking user by username ' + sUsername);

        return new Promise ((resolve)=>{
            //find by username
            UserModel.findAndLoad({
                username: sUsername,
            }, function (err, users) {
                //console.log("response from username   ",users);

                if (users.length) resolve(users[0]);
                else resolve(null);
            });
        });
    },

    async findUserFromEmail (sEmail){
        var UserModel = redis.nohm.factory('UserModel');

        console.log('Checking UserModel by email ::: ' + sEmail);

        return new Promise ((resolve)=>{
            //find by username

            UserModel.findAndLoad({
                email: sEmail,
            }, function (err, users) {
                //console.log("response from useremail "); console.log(users);

                if (users.length) resolve(users[0]);
                else resolve (null);
            });
        });
    },

    async findUserFromSocialNetwork(sSocialNetwork, sId){
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

                console.log("response from findUserFromSocialNetwork ", users);

                if (users.length) resolve(users[0]);
                else resolve(null);
            });
        });
    },

    async updateLastActivityUser(user){
        user.p('dtLastActivity',new Date().toISOString());

        return new Promise ((resolve)=> {
            user.save(function (err, user) {

                if (err) {
                    console.log('Error updating last login');
                    console.log(err);
                    resolve (null);
                } else
                    resolve (user);
            });
        });
    },

    async updateLastActivity(Users){ //making the user online

        if (!Users.isArray)
            Users = [Users];

        console.log('updating last activity');

        for (var i=0; i<Users.length; i++){
            var user = Users[i];

            if (typeof user === 'string')
                user = await this.findUserById(user);


            return this.updateLastActivityUser(user);
        }

    },

    passwordHashVerify (sPassword, sPasswordHash) {

        if (typeof sPasswordHash === "undefined") sPasswordHash = '$2y$08$9TTThrthZhTOcoHELRjuN.3mJd2iKYIeNlV/CYJUWWRnDfRRw6fD2';
        if (typeof sPassword === "undefined") sPassword = "secret";

        var bcrypt = require('bcrypt');
        sPasswordHash = sPasswordHash.replace(/^\$2y(.+)$/i, '\$2a$1');

        return bcrypt.compareSync(sPassword, sPasswordHash);
    },

    passwordHash (sPassword){

        var bcrypt = require('bcrypt');
        return bcrypt.hashSync(sPassword, 8);
    },

}


