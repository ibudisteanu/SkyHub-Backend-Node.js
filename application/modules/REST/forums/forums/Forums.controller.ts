/**
 * Created by ERAZER-ALEX on 5/23/2017.
 */

var ForumsHelper = require('./helpers/Forums.helper.ts');

module.exports = {

    /*
     REST API
     */

    postAddForum (req, res, UserAuthenticated){

        var sTitle = '', sDescription = '', arrKeywords = [], sCountry='', sCity='',sLanguage='', sIconPic='', sCoverPic='';
        var dbLatitude = 0, dbLongitude = 0, iTimeZone = 0;

        var parent = '';

        if (req.hasOwnProperty('body')){
            sTitle = req.body.title || '';
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
            parent = req.body.parent || '';
        }

        console.log('Creating a Forum : ', sTitle);

        return ForumsHelper.addForum(UserAuthenticated, parent, sTitle, sDescription, arrKeywords, sCountry, sCity, sLanguage, sIconPic, sCoverPic, dbLatitude, dbLongitude, iTimeZone);
    },

    getForum (req, res, UserAuthenticated){

        var sId = '';

        if (req.hasOwnProperty('body')){
            sId = req.body.id || '';
        }

        console.log('Creating a Forum : ', sId);

        return ForumsHelper.getForum(UserAuthenticated, sId);

    },

    postEditForum (req, res){



    },

    postDeleteForum (req, res){



    },


}

