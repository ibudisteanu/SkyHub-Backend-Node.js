/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */


var NotificationsHelper = require('./helpers/Notifications.helper.ts');

var AuthenticatingUser = require('../auth/helpers/AuthenticatingUser.helper.ts');

module.exports = {

    /*
     REST API
     */

    async postGetNotifications (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let pageIndex = 0;
        let pageCount = 8;

        if (req.hasOwnProperty('body')) {
            pageIndex = req.body.pageIndex || 0;
            pageCount = req.body.pageCount || 8;
        }

        if (userAuthenticated === null){
            return {
                result:false,
                message: 'You are not authenticated',
            }
        }

        let result = await NotificationsHelper.getUserNotifications(userAuthenticated, pageIndex, pageCount);

        return {
            result:true,
            notifications: result,
        }

    },

    async postMarkNofication (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let notificationId = '';
        let markAll = false;
        let markValue = true;

        if (req.hasOwnProperty('body')) {
            notificationId = req.body.notificationId || '';
            markAll = req.body.markAll || false;

            if (typeof (req.body.markValue !== 'undefined'))
                markValue = req.body.markValue;
        }

        if (userAuthenticated === null){
            return {
                result: false,
                message: 'You are not authenticated',
            }
        }

        let result = await VotingHelper.markNotification(userAuthenticated, notificationId, markAll, markValue);

        return {
            result: true,
            notifications: result
        }

    },

}