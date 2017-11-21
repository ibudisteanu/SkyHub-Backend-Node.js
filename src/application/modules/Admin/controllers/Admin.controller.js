/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

import * as redis from 'DB/redis_nohm'
import constants from 'bin/constants'

import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';
import AdminHelper from 'Admin/helpers/Admin.helper';

class AdminController {

    async postSort(req, res){



        return await AdminHelper.sort(req.userAuthenticated);
    }

    async postReplaceUploadedFilesSubstring(req, res){

        //callback (  {message: AdminCtrl.replaceUploadedFilesSubstring("myskyhub.ddns.net:4000","skyhub.me:4000") });
        //callback (  {message: AdminCtrl.replaceUploadedFilesSubstring("http://skyhub.me:4000/uploads","http://skyhub.me:4000/public/uploads") });
        return await AdminHelper.replaceUploadedFilesSubstring(req.userAuthenticated, "myskyhub.ddns.net:4000", "skyhub.me:4000" );

    }


    async postBuildAllPagesLists(req, res){

        return await AdminHelper.buildAllPagesLists(req.userAuthenticated);
    }


    async postBuildNotificationsSubscribersLists(req, res){

        return await AdminHelper.buildNotificationsSubscribersLists(req.userAuthenticated);
    }

    async postCopyDB(req, res){


        let dbSource, dbDestination;
        if (typeof req.params !== 'undefined') {
            dbSource = req.params.dbSource;
            dbDestination = req.params.dbDestination;
        } else {
            dbSource = req.body.dbSource;
            dbDestination = req.body.dbDestination;
        }

        return await AdminHelper.copyDB(req.userAuthenticated, dbSource, dbDestination);
    }
}


module.exports = new AdminController();