/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopicsHelper = require('./helpers/Topics.helper.js');

var AuthenticatingUser = require('../../users/auth/helpers/AuthenticatingUser.helper.js');

module.exports = {

    /*
     REST API
     */

    async postAddTopic (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let sTitle = '',  sShortDescription = '', sDescription = '', arrAttachments=[], arrKeywords = [], sCountry='', sCity='',sLanguage='';
        let dbLatitude = 0, dbLongitude = 0, sCoverPic='', arrAdditionalInfo = {};

        let parent = '';

        //console.log("@@@@@@@@@@@@@@ postAddTopic request", userAuthenticated);

        if (req.hasOwnProperty('body')){
            sTitle = req.body.title || '';

            sDescription = req.body.description ||  '';
            sShortDescription = req.body.shortDescription ||  '';
            sCoverPic = req.body.coverPic || '';

            arrKeywords = req.body.keywords || [];
            arrAttachments = req.body.attachments || [];

            sCountry = req.body.country || '';
            sCity = req.body.city || '';

            dbLatitude = req.body.latitude || -666;
            dbLongitude = req.body.longitude || -666;

            sLanguage = req.body.language || sCountry;

            arrAdditionalInfo = req.body.additionalInfo || {};
            if (typeof (arrAdditionalInfo) === 'string') arrAdditionalInfo = JSON.parse(arrAdditionalInfo);
            if (typeof arrAdditionalInfo.scraped !== 'undefined') arrAdditionalInfo.scraped = !!+(arrAdditionalInfo.scraped);

            parent = req.body.parent || '';
        }

        console.log('Creating a Topic : ', sTitle);

        return await TopicsHelper.addTopic(userAuthenticated, parent, sTitle, sDescription, sShortDescription, arrAttachments, sCoverPic, arrKeywords, sCountry, sCity, sLanguage, dbLatitude, dbLongitude, null, arrAdditionalInfo);
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

