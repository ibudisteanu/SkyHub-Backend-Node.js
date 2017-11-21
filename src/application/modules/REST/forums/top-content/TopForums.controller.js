/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/14/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopForumsHelper = require('./helpers/TopForums.helper.js');
var TopContentHelper = require ('REST/forums/top-content/helpers/TopContent.helper.js');
import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

module.exports = {

    /*
     REST API
     */

    async postGetTopForums (req, res){

        let sParent = ''; let iPageIndex=1; let iPageCount = 8;

        if (req.hasOwnProperty('body')){
            sParent = req.body.parent || '';
            iPageIndex = req.body.pageIndex || 1;
            iPageCount = req.body.pageCount || 8;
        }

        console.log('Getting Top Forums : ', sParent);

        return TopForumsHelper.getTopForums(req.userAuthenticated, sParent, iPageIndex, iPageCount);

    },

    async postGetForum (req, res){

        let sId = '';

        if (req.hasOwnProperty('body')){

            sId = req.body.id ||'';
        }

        console.log(""); console.log(""); console.log(""); console.log("");
        //console.log(req);
        console.log('Getting Forum Content : ', '"'+sId+'"');

        return TopContentHelper.getContent(req.userAuthenticated, sId);

    },


}