/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/15/2017.
 * (C) BIT TECHNOLOGIES
 */

/**
 * Created by ERAZER-ALEX on 6/4/2017.
 */

var TopContentHelper = require('./helpers/TopContent.helper.ts');
var AuthenticatingUser = require('../../auth/helpers/AuthenticatingUser.helper.ts');
var URLHashHelper = require ('../../common/URLs/helpers/URLHash.helper.ts');

module.exports = {

    /*
     REST API
     */

    async postGetURLSlug (req, res){

        let sName = '';

        if (req.hasOwnProperty('body')){

            sName = req.body.name ||'';
        }

        if (sName.length < 3)
            return {result:false, message:"To few letters"};

        let urlSlug = await URLHashHelper.getFinalNewURL(sName,null);

        if (urlSlug !== null)
            return {result:true, URLSlug: urlSlug, message: "Great URL"};
        else
            return {result:false, message: "Strange data input"};
    }


}