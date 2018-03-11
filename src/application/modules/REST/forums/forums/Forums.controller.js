/**
 * Created by ERAZER-ALEX on 5/23/2017.
 */

import ForumsHelper from './helpers/Forums.helper'
import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

export default {

    /*
     REST API
     */

    async postAddForum (req, res){

        let sName = '', sTitle = '', sDescription = '', arrKeywords = [], sCountry='', sCity='',sLanguage='', sIconPic='', sCoverPic='', sCoverColor = '';
        let dbLatitude = 0, dbLongitude = 0, arrAdditionalInfo = {} ;

        let parent = '';

        //console.log("@@@@@@@@@@@@@@ psotAddForm request", userAuthenticated);

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

            sIconPic = req.body.iconPic || '';
            sCoverPic = req.body.coverPic || '';
            sCoverColor = req.body.coverColor || '';

            arrAdditionalInfo = req.body.additionalInfo || {};
            if (typeof (arrAdditionalInfo) === 'string') arrAdditionalInfo = JSON.parse(arrAdditionalInfo);
            if (typeof arrAdditionalInfo.scraped !== 'undefined') arrAdditionalInfo.scraped = !!+(arrAdditionalInfo.scraped);

            parent = req.body.parent || '';
        }

        console.log('Creating a Forum : ', sTitle);

        return await ForumsHelper.addForum(req.userAuthenticated, parent, sName, sTitle, sDescription, arrKeywords, sCountry, sCity, sLanguage, sIconPic, sCoverPic, sCoverColor, dbLatitude, dbLongitude, null, arrAdditionalInfo);
    },

    async getForum (req, res){

        var sId = '';

        if (req.hasOwnProperty('body')){
            sId = req.body.id || '';
        }

        console.log('Creating a Forum : ', sId);

        return await ForumsHelper.getForum(req.userAuthenticated, sId);

    },

    postEditForum (req, res){



    },

    postDeleteForum (req, res){



    },


}

