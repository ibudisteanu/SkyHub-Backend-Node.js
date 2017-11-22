/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */


import NotificationsHelper from 'REST/notifications/notifications/helpers/Notifications.helper'

import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

module.exports = {

    /*
     REST API
     */

    async postGetLastNotifications (req, res){s
        if (req.userAuthenticated === null){
            return {
                result:false,
                message: 'You are not authenticated',
            }
        }

        let notifications = await NotificationsHelper.getUserNotifications(req.userAuthenticated, 1, 8);
        let unreadNotifications = await NotificationsHelper.getUnreadNotifications(req.userAuthenticated);

        return {
            result:true,
            unreadNotifications: unreadNotifications,
            notifications: notifications,
        }

    },

    async postGetNotifications (req, res){

        let pageIndex = 0;
        let pageCount = 8;

        if (req.hasOwnProperty('body')) {
            pageIndex = req.body.pageIndex || 0;
            pageCount = req.body.pageCount || 8;
        }

        if (req.userAuthenticated === null){
            return {
                result:false,
                message: 'You are not authenticated',
            }
        }

        let notifications = await NotificationsHelper.getUserNotifications(req.userAuthenticated, pageIndex, pageCount);
        let unreadNotifications = await NotificationsHelper.getUnreadNotifications(req.userAuthenticated);

        return {
            result:true,
            unreadNotifications: unreadNotifications,
            notifications: notifications,
        }

    },

    async postMarkNotificationRead (req, res){

        let notificationId = '';
        let markAll = false;
        let markValue = true;

        if (req.hasOwnProperty('body')) {
            notificationId = req.body.notificationId || '';
            markAll = req.body.markAll || false;

            if (typeof (req.body.markValue !== 'undefined'))
                markValue = req.body.markValue;
        }

        return await NotificationsHelper.markNotificationRead(req.userAuthenticated, notificationId, markAll, markValue);

    },

    async postResetNotificationUnreadCounter (req, res){

        return await NotificationsHelper.resetNotificationsUnreadCounter(req.userAuthenticated);
    },

    async postMarkNotificationShown (req, res){

        let notificationId = '';

        if (req.hasOwnProperty('body')) {
            notificationId = req.body.notificationId || '';
        }

        return await NotificationsHelper.markNotificationShown(req.userAuthenticated, notificationId);

    },

}