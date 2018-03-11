/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
 ADMIN
 */

// api/admin/XXXXX

import AdminCtrl from 'Admin/controllers/Admin.controller.js';

let routesHTTP = {



};

/*
            SOCKET ROUTES
 */

let routesSocket = {

};


/*
            COMMON ROUTES
 */

let routesCommon = {
    '/sort': async (req, res, callback) => {
        callback (  await AdminCtrl.postSort(req, res) );
    },

    '/replace-uploaded-files-substring': async (req, res, callback)=> {

        callback (await AdminCtrl.postReplaceUploadedFilesSubstring(req, res) );

    },

    '/build-notifications-subscribers-lists': async (req, res, callback) => {

        callback ( await AdminCtrl.postBuildNotificationsSubscribersLists(req, res,) );
    },

    '/build-all-pages-lists': async (req, res, callback) => {

        callback ( await AdminCtrl.postBuildAllPagesLists(req, res,) );
    },

    '/copy-DB/:dbSource/:dbDestination': async (req, res, callback) => {

        console.log('copy-DB HIT');
        callback ( await AdminCtrl.postCopyDB(req, res) );
    },

    '/copy-DB': async (req, res, callback) => {

        console.log('copy-DB HIT');
        callback ( await AdminCtrl.postCopyDB(req, res) );
    },
};

export {
    routesCommon,
    routesHTTP,
    routesSocket,
}
