/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/30/2017.
 * (C) BIT TECHNOLOGIES
 */

var RepliesHelper = require('./helpers/Replies.helper.js');

import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

module.exports = {

    /*
     REST API
     */

    async postAddReply (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let parent='', parentReply = '', sTitle = '', sDescription = '', arrKeywords = [], arrAttachments = [], sCountry='', sCity='',sLanguage='';
        let dbLatitude = 0, dbLongitude = 0, arrAdditionalInfo=[];

        //console.log("@@@@@@@@@@@@@@ postAddReply request", userAuthenticated);

        if (req.hasOwnProperty('body')){
            sTitle = req.body.title || '';

            sDescription = req.body.description ||  '';
            arrKeywords = req.body.keywords || [];
            arrAttachments = req.body.attachments || [];

            sCountry = req.body.country || '';
            sCity = req.body.city || '';
            sLanguage = req.body.language || sCountry;

            dbLatitude = req.body.latitude || -666;
            dbLongitude = req.body.longitude || -666;

            arrAdditionalInfo = req.body.additionalInfo || {};
            if (typeof (arrAdditionalInfo) === 'string') arrAdditionalInfo = JSON.parse(arrAdditionalInfo);
            if (typeof arrAdditionalInfo.scraped !== 'undefined') arrAdditionalInfo.scraped = !!+(arrAdditionalInfo.scraped);

            parentReply = req.body.parentReply || '';
            parent = req.body.parent || '';
        }

        console.log('Creating a Reply : ', sTitle);

        return await RepliesHelper.addReply(userAuthenticated, parent, parentReply, sTitle, sDescription, arrAttachments, arrKeywords, sCountry, sCity, sLanguage, dbLatitude, dbLongitude, null, arrAdditionalInfo);
    },

    async getReply (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        var sId = '';

        if (req.hasOwnProperty('body')){
            sId = req.body.id || '';
        }

        console.log('getting a Reply : ', sId);

        return await RepliesHelper.getReply(userAuthenticated, sId);

    },

    postEditReply (req, res){



    },

    postDeleteReply (req, res){



    },


}

