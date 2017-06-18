/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

var ForumsHelper = require('./helpers/Forums.helper.ts');

var AuthenticatingUser = require('../../auth/helpers/AuthenticatingUser.helper.ts');

module.exports = {

    /*
     REST API
     */

    async postAddForum (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let sName = '', sTitle = '', sDescription = '', arrKeywords = [], sCountry='', sCity='',sLanguage='', sIconPic='', sCoverPic='', sCoverColor = '';
        let dbLatitude = 0, dbLongitude = 0, iTimeZone = 0;

        let parent = '';

        console.log("@@@@@@@@@@@@@@ psotAddForm request", userAuthenticated);

        if (req.hasOwnProperty('body')){
            sTitle = req.body.title || '';
            sName= req.body.name || '';
            sDescription = req.body.description ||  '';
            arrKeywords = req.body.keywords || [];

            sCountry = req.body.country || '';
            sCity = req.body.city || '';

            dbLatitude = req.body.latitude || -666;
            dbLongitude = req.body.longitude || -666;

            sLanguage = req.body.language || sCountry;
            iTimeZone = req.body.timeZone || 0;

            sIconPic = req.body.iconPic || '';
            sCoverPic = req.body.coverPic || '';
            sCoverColor = req.body.coverColor || '';
            parent = req.body.parent || '';
        }

        console.log('Creating a Forum : ', sTitle);

        return await ForumsHelper.addForum(userAuthenticated, parent, sName, sTitle, sDescription, arrKeywords, sCountry, sCity, sLanguage, sIconPic, sCoverPic, sCoverColor, dbLatitude, dbLongitude, iTimeZone);
    },

    async getForum (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        var sId = '';

        if (req.hasOwnProperty('body')){
            sId = req.body.id || '';
        }

        console.log('Creating a Forum : ', sId);

        return await ForumsHelper.getForum(userAuthenticated, sId);

    },

    postEditForum (req, res){



    },

    postDeleteForum (req, res){



    },


}

