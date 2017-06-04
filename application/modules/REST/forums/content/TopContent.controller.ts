/**
 * Created by ERAZER-ALEX on 6/4/2017.
 */

var TopContentHelper = require('./helpers/TopContent.helper.ts');

module.exports = {

    /*
     REST API
     */

    getTopContent (req, res, UserAuthenticated){

        var sParent = '';

        if (req.hasOwnProperty('body')){
            sParent = req.body.parent || '';
        }

        console.log('Creating a Forum : ', sParent);

        return TopContentHelper.getTopContent(UserAuthenticated, sParent);

    },


}