/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/14/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopForumsHelper = require('./helpers/TopForums.helper.ts');
var AuthenticatingUser = require('../../users/auth/helpers/AuthenticatingUser.helper.ts');

module.exports = {

    /*
     REST API
     */

    async postGetTopForums (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let sParent = ''; let iPageIndex=1; let iPageCount = 8;

        if (req.hasOwnProperty('body')){
            sParent = req.body.parent || '';
            iPageIndex = req.body.pageIndex || 1;
            iPageCount = req.body.pageCount || 8;
        }

        console.log('Getting Top Forums : ', sParent);

        return TopForumsHelper.getTopForums(userAuthenticated, sParent, iPageIndex, iPageCount);

    },

    async postGetForum (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let sId = '';

        if (req.hasOwnProperty('body')){

            sId = req.body.id ||'';
        }

        console.log(""); console.log(""); console.log(""); console.log("");
        //console.log(req);
        console.log('Getting Forum Content : ', '"'+sId+'"');

        return TopContentHelper.getContent(userAuthenticated, sId);

    },


}