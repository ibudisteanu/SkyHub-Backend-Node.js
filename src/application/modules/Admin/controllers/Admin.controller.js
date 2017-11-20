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

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        return await AdminHelper.sort(userAuthenticated);
    }

    async postReplaceUploadedFilesSubstring(req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        //callback (  {message: AdminCtrl.replaceUploadedFilesSubstring("myskyhub.ddns.net:4000","skyhub.me:4000") });
        //callback (  {message: AdminCtrl.replaceUploadedFilesSubstring("http://skyhub.me:4000/uploads","http://skyhub.me:4000/public/uploads") });
        return await AdminHelper.replaceUploadedFilesSubstring(userAuthenticated, "myskyhub.ddns.net:4000", "skyhub.me:4000" );

    }


    async postBuildAllPagesLists(req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);
        return await AdminHelper.buildAllPagesLists(userAuthenticated);
    }


    async postBuildNotificationsSubscribersLists(req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);
        return await AdminHelper.buildNotificationsSubscribersLists(userAuthenticated);
    }

    async postCopyDB(req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let dbSource, dbDestination;
        if (typeof req.params !== 'undefined') {
            dbSource = req.params.dbSource;
            dbDestination = req.params.dbDestination;
        } else {
            dbSource = req.body.dbSource;
            dbDestination = req.body.dbDestination;
        }

        return await AdminHelper.copyDB(userAuthenticated, dbSource, dbDestination);
    }
}


module.exports = new AdminController();