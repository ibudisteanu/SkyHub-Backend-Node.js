var users = require('./users.model.ts');

module.exports = {

    /*
        REST API
     */

    postAuthenticateLogin : function (req, res){

        var sEmailUsername = '', sUserPassword = '';

        if (req.hasOwnProperty('body')){

            sEmailUsername = typeof req.body.emailUsername !== 'undefined' ? req.body.emailUsername : '';
            sUserPassword = typeof req.body.password !== 'undefined' ? req.body.password : '';
        }

        console.log(sEmailUsername);
        console.log(sUserPassword);

        return new Promise ( (resolve) => {

            users.findUserFromEmailUsernamePassword(sEmailUsername, sUserPassword).then ( (loggedInUser)=>{

                //console.log(loggedInUser ); console.log(typeof loggedInUser);

                if (loggedInUser !== null)
                {
                    //console.log(loggedInUser.getFullName());
                    //console.log(loggedInUser.getPublicInformation());

                    users.updateLastActivity(loggedInUser);

                    resolve( {
                        result: 'true',
                        message: 'Welcome back, '+loggedInUser.getFullName(),
                        user :  loggedInUser.getPublicInformation(),
                        auth_key: this.generateAuthTokenId(),
                    });
                } else
                resolve({
                    result: 'false',
                    message: "Wrong Username/Email or Password",
                });

            });

        });

    },

    postAuthenticateRegister: function (req, res){

        var sEmail = '', sUsername = '', sPassword = '', sFirstName = '', sLastName = '', sLastName='', sCountry='', sCity='',sLanguage='', sProfilePic='', sCoverPic='';

        if (req.hasOwnProperty('body')){
            sEmail = typeof req.body.email !== 'undefined' ? req.body.email : '';
            sUsername = typeof req.body.username !== 'undefined' ?  req.body.username : '';
            sPassword = typeof req.body.password !== 'undefined' ?  req.body.password : '';
            sFirstName = typeof req.body.firstName !== 'undefined' ?  req.body.firstName : '';
            sLastName = typeof req.body.lastName !== 'undefined' ?  req.body.lastName : '';
            sCountry = typeof req.body.country !== 'undefined' ?  req.body.country : '';
            sCity = typeof req.body.city !== 'undefined' ?  req.body.city : '';

            if (req.body.hasOwnProperty('language')) sLanguage = req.body.language;
            else sLanguage = sCountry;

            if (req.body.hasOwnProperty('profilePic')) sProfilePic = req.body.profilePic;
            if (req.body.hasOwnProperty('coverPic')) sCoverPic = req.body.coverPic;
        }

        console.log(sEmail);

        return users.registerUser(sEmail, sUsername, sPassword, sFirstName, sLastName, sCountry, sCity, sLanguage, sProfilePic, sCoverPic);
    },

    /*
        HELPER FUNCTIONS
     */

    generateAuthTokenId : function()
    {
        var hat = require('hat');
        return hat();
    }

};