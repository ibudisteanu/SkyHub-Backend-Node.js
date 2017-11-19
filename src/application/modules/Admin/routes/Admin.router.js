/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
 ADMIN
 */

// api/admin/XXXXX

let routesHTTP = {

    '/sort': async (req, res, callback) => {
        let AdminCtrl = require ('../Admin.controller.js');
        callback (  {message: AdminCtrl.sort() });
    },

    '/replace-uploaded-files-substring': async (req, res, callback)=> {
        let AdminCtrl = require ('../Admin.controller.js');

        //callback (  {message: AdminCtrl.replaceUploadedFilesSubstring("myskyhub.ddns.net:4000","skyhub.me:4000") });
        //callback (  {message: AdminCtrl.replaceUploadedFilesSubstring("http://skyhub.me:4000/uploads","http://skyhub.me:4000/public/uploads") });
        callback ( {message: AdminCtrl.replaceUploadedFilesSubstring("myskyhub.ddns.net:4000","skyhub.me:4000") });
    },

    '/build-notifications-subscribers-lists': async (req, res, callback) => {
        let AdminCtrl = require ('../Admin.controller.js');
        callback ( {message: AdminCtrl.buildNotificationsSubscribersLists() });
    },

    '/build-all-pages-lists': async (req, res, callback) => {
        let AdminCtrl = require ('../Admin.controller.js');
        callback ( {message: AdminCtrl.buildAllPagesLists() });
    },
}

/*
            SOCKET ROUTES
 */

let routesSocket = {

};


/*
            COMMON ROUTES
 */

let routesCommon = {

}

module.exports.routesCommon = routesCommon;
module.exports.routesHTTP = routesHTTP;
module.exports.routesSocket = routesSocket;