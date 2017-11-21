/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/30/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopRepliesHelper = require('./helpers/TopReplies.helper.js');
import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

module.exports = {

    /*
     REST API
     */

    async postGetTopReplies (req, res){

        let sParent = ''; let iPageIndex=1; let iPageCount = 8;

        if (req.hasOwnProperty('body')){
            sParent = req.body.parent || '';
            iPageIndex = req.body.pageIndex || 1;
            iPageCount = req.body.pageCount || 8;
        }

        console.log('Getting Top Replies : ', sParent);

        return TopRepliesHelper.getTopReplies(req.userAuthenticated, sParent, iPageIndex, iPageCount);
    },

    async postGetAllReplies (req, res){

        let sParent = '';

        if (req.hasOwnProperty('body'))
            sParent = req.body.parent || '';

        console.log('Getting All Replies : ', sParent);
        console.log('rezultat: ', await TopRepliesHelper.getAllReplies(req.userAuthenticated, sParent));

        return await TopRepliesHelper.getAllReplies(req.userAuthenticated, sParent);
    },


    async postGetReply (req, res){

        let sId = '';

        if (req.hasOwnProperty('body')){

            sId = req.body.id ||'';
        }

        console.log(""); console.log(""); console.log(""); console.log("");
        //console.log(req);
        console.log('Getting Replies Content : ', '"'+sId+'"');

        return TopRepliesHelper.getContent(req.userAuthenticated, sId);

    },


}