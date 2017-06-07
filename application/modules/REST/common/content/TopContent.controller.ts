/**
 * Created by ERAZER-ALEX on 6/4/2017.
 */

var TopContentHelper = require('./helpers/TopContent.helper.ts');

module.exports = {

    /*
     REST API
     */

    async postGetTopContent (req, res, UserAuthenticated){

        let sParent = ''; let iPageIndex=1; let iPageCount = 8;

        if (req.hasOwnProperty('body')){
            sParent = req.body.parent || '';
            iPageIndex = req.body.pageIndex || 1;
            iPageCount = req.body.pageCount || 8;
        }

        console.log('Getting Top Content : ', sParent);

        return TopContentHelper.getTopContent(UserAuthenticated, sParent, iPageIndex, iPageCount);

    },

    async postGetContent (req, res, UserAuthenticated){

        let sId = '';

        if (req.hasOwnProperty('body')){

            sId = req.body.id ||'';

        }

        console.log(""); console.log(""); console.log(""); console.log("");
        //console.log(req);
        console.log('Getting Content : ', sId);

        return TopContentHelper.getContent(UserAuthenticated, sId);

    }


}