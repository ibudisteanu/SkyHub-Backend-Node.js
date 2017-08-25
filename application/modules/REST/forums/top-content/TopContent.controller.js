/**
 * Created by ERAZER-ALEX on 6/4/2017.
 */

var TopContentHelper = require('./helpers/TopContent.helper.js');
var AuthenticatingUser = require('../../users/auth/helpers/AuthenticatingUser.helper.js');

module.exports = {

    /*
     REST API
     */

    async postGetTopContent (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let sParent = ''; let iPageIndex=1; let iPageCount = 8;

        console.log("----"); console.log("----"); console.log("----"); console.log("----");
        console.log("body",req.body);

        if (req.hasOwnProperty('body')){
            sParent = req.body.parent || '';
            iPageIndex = req.body.pageIndex || 1;
            iPageCount = req.body.pageCount || 8;
        }

        console.log('Getting Top Content : ', sParent);

        return TopContentHelper.getTopContent(userAuthenticated, sParent, iPageIndex, iPageCount);

    },

    async postGetContent (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let sId = '';

        if (req.hasOwnProperty('body')){

            sId = req.body.id ||'';

        }

        console.log(""); console.log(""); console.log(""); console.log("");
        //console.log(req);
        console.log('Getting Content : ', '"'+sId,res.body);

        return TopContentHelper.getContent(userAuthenticated, sId);

    }


}