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
            sEmail = req.body.email || '';
            sUsername = req.body.username ||  '';
            sPassword = req.body.password || '';
            sFirstName = req.body.firstName ||  '';
            sLastName = req.body.lastName ||  '';
            sCountry = req.body.country || '';
            sCity = req.body.city || '';

            sLanguage = req.body.language || sCountry;

            sProfilePic = req.body.profilePic || '';
            sCoverPic = req.body.coverPic || '';
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