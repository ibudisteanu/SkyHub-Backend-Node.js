/**
 * Created by ERAZER-ALEX on 6/4/2017.
 */

var TopContentHelper = require('./helpers/TopContent.helper.ts');

module.exports = {

    /*
     REST API
     */

    postGetTopContent (req, res, UserAuthenticated){

        let sParent = ''; let iPageIndex=1; let iPageCount = 8;

        if (req.hasOwnProperty('body')){
            sParent = req.body.parent || '';
            iPageIndex = req.body.pageIndex || 1;
            iPageCount = req.body.pageCount || 8;
        }

        console.log('Creating a Forum : ', sParent);

        return TopContentHelper.getTopContent(UserAuthenticated, sParent, iPageIndex, iPageCount);

    },


}