/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */


var NotificationsHelper = require('./helpers/Notifications.helper.js');

import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

module.exports = {

    /*
     REST API
     */

    async postGetLastNotifications (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);


        if (userAuthenticated === null){
            return {
                result:false,
                message: 'You are not authenticated',
            }
        }

        let notifications = await NotificationsHelper.getUserNotifications(userAuthenticated, 1, 8);

        return {
            result:true,
            unreadNotifications: await NotificationsHelper.getUnreadNotifications(userAuthenticated),
            notifications: notifications,
        }

    },

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

        let notifications = await NotificationsHelper.getUserNotifications(userAuthenticated, pageIndex, pageCount);

        return {
            result:true,
            unreadNotifications: await NotificationsHelper.getUnreadNotifications(userAuthenticated),
            notifications: notifications,
        }

    },

    async postMarkNotificationRead (req, res){

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

        let result = await NotificationsHelper.markNotificationRead(userAuthenticated, notificationId, markAll, markValue);

        return {
            result: true,
            notifications: result
        }

    },

    async postResetNotificationUnreadCounter (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        if (userAuthenticated === null){
            return {
                result: false,
                message: 'You are not authenticated',
            }
        }

        await NotificationsHelper.resetNotificationsUnreadCounter(userAuthenticated);

        return {
            result: true,
        }

    },

    async postMarkNotificationShown (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let notificationId = '';

        if (req.hasOwnProperty('body')) {
            notificationId = req.body.notificationId || '';
        }

        if (userAuthenticated === null){
            return {
                result: false,
                message: 'You are not authenticated',
            }
        }

        let result = await NotificationsHelper.markNotificationShown(userAuthenticated, notificationId);

        return {
            result: true,
        }

    },

}