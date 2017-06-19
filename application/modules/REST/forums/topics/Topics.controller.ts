/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopicsHelper = require('./helpers/Topics.helper.ts');

var AuthenticatingUser = require('../../auth/helpers/AuthenticatingUser.helper.ts');

module.exports = {

    /*
     REST API
     */

    async postAddTopic (req, res){

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

        return await TopicsHelper.addTopic(userAuthenticated, parent, sName, sTitle, sDescription, arrKeywords, sCountry, sCity, sLanguage, sIconPic, sCoverPic, sCoverColor, dbLatitude, dbLongitude, iTimeZone);
    },

    async getTopic (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        var sId = '';

        if (req.hasOwnProperty('body')){
            sId = req.body.id || '';
        }

        console.log('Creating a Topic : ', sId);

        return await TopicsHelper.getTopic(userAuthenticated, sId);

    },

    postEditTopic (req, res){



    },

    postDeleteTopic (req, res){



    },


}

