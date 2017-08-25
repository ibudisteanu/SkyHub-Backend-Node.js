/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/15/2017.
 * (C) BIT TECHNOLOGIES
 */

/**
 * Created by ERAZER-ALEX on 6/4/2017.
 */

var ContentHelper = require('./helpers/Content.helper.js');
var AuthenticatingUser = require('../../users/auth/helpers/AuthenticatingUser.helper.js');
var URLHashHelper = require ('../../common/URLs/helpers/URLHash.hashlist.js');
var MaterializedParentsHelper = require ('../../../DB/common/materialized-parents/MaterializedParents.helper.js');

module.exports = {

    /*
     REST API
     */

    async postGetURLSlug (req, res){

        let sName = '', sParentURL = '';

        if (req.hasOwnProperty('body')){

            sParentURL = req.body.parent || '';
            sName = req.body.name ||'';
        }

        if (sName.length < 3)
            return {result:false, message:"To few letters"};

        let urlSlug = await URLHashHelper.getFinalNewURL(sParentURL, sName,null);

        if (urlSlug !== null)
            return {result:true, URLSlug: urlSlug, message: "Great URL"};
        else
            return {result:false, message: "Strange data input"};
    },


    async postSetIcon (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let icon = ''; let id='';
        if (req.hasOwnProperty('body')){

            if (typeof req.body.icon !== 'undefined')
                icon = req.body.icon || '';

            if (typeof req.body.profilePic !== 'undefined')
                icon = req.body.profilePic || '';
            
            id = req.body.id || '';
        }

        return await ContentHelper.setIcon(userAuthenticated, id, icon );

    },

    async postSetCover (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let cover = ''; let id='';
        if (req.hasOwnProperty('body')){
            cover = req.body.cover || '';
            id = req.body.id || '';
        }

        return await ContentHelper.setCover(userAuthenticated, id, cover);

    },

    async postDeleteObject (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let id='';
        if (req.hasOwnProperty('body')){
            id = req.body.id || '';
        }

        return await ContentHelper.deleteObject(userAuthenticated, id);

    }

}