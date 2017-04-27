var users = require('./users.model.ts');

module.exports = {

    /*
        REST API
     */

    postAuthenticateLogin : function (req, res){

        var sEmailUsername = '', sUserPassword = '';

        if (req.hasOwnProperty('body')){
            sEmailUsername = req.body.emailUserName;
            sUserPassword = req.body.userPassword;
        }

        console.log(sEmailUsername);
        console.log(sUserPassword);

        if (1==1)
        {
            return {
                result: 'true',
                message: 'Welcome back, ',
                auth_key: this.generateAuthTokenId(),
            }
        } else
            return {
                result: 'false',
                message: "Wrong Username/Email or Password",
            }
    },

    postAuthenticateRegister: function (req, res){

        var sEmail = '', sUsername = '', sUserPassword = '';

        if (req.hasOwnProperty('body')){
            sEmail = req.body.email;
            sUsername = req.body.userName;
            sUserPassword = req.body.userPassword;
        }

        return users.createDummyUser(1);
    },

    /*
        HELPER FUNCTIONS
     */

    generateAuthTokenId : function()
    {
        var hat = require('hat');
        return hat();
    }

}