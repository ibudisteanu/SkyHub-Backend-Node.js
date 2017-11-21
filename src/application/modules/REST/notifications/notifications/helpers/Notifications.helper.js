/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/2/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
    My Solution is using :

        1 Lists, the reading is O(1), insert O(1),
        1. HashList for information like how many unread notifications are
            info:userId
        2. HashList to read/unread
            read:userId

 */


let List = require ('DB/Redis/lists/List.helper.js');
let HashList = require ('DB/Redis/lists/HashList.helper.js');
let commonFunctions = require ('../../../common/helpers/CommonFunctions.helper.js');
let nohmIterator = require ('DB/Redis/nohm/nohm.iterator');
let Notification = require ('../models/Notification.model.js');
let SanitizeAdvanced = require('../../../common/helpers/SanitizeAdvanced.js');

const NOTIFICATIONS_DB_MAXIMUM = 100;

class NotificationsListHelper {

    //sortedList
    constructor(){
        this.list = new List("Notifications:list");
        this.hashList = new HashList("Notifications");
    }

    async getUserNotifications(userAuthenticated, pageIndex, pageCount){

        if (userAuthenticated === null)
            return []

        if (typeof pageCount === 'undefined') pageCount = 8;
        pageCount = Math.min(pageCount, 20);

        let userId = userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        let answer = await this.list.listRange(userId, (pageIndex-1)*pageCount, pageIndex*pageCount);
        let result = [];

        //console.log('#####',answer);

        if (answer !== null){
            for (let i=0; i<answer.length; i++) {
                let obj = JSON.parse(answer[i]); //the data in the DB is stringified

                let notification = new Notification(obj);

                notification.read = await this.getReadNotificationStatus(userAuthenticated, notification.id);
                if (notification.read === null)  notification.read = false;

                notification.shown = await this.getShownNotificationStatus(userAuthenticated, notification.id);
                if (notification.shown === null) notification.shown = false;

                notification.x="DDDD";

                result.push(notification);
            }
        }

        //console.log('######## ##########', result);

        return result;
    }

    async markNotificationRead(userAuthenticated, notificationId, markAll, markValue){

        if (userAuthenticated === null)
            return {result: false, message: 'You are not authenticated'};

        if (typeof markValue === 'undefined') readValue = true;
        if (typeof notificationId === 'object') notificationId = notificationId.id;

        let userId =  userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        if (markAll){
            let notifications = await this.list.listRange(userId,0, NOTIFICATIONS_DB_MAXIMUM-1);

            //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@ notifications', notifications);

            for (let i=0; i<notifications.length; i++) {
                notifications[i] = new Notification(JSON.parse(notifications[i]));
            }

            for (let i=0; i<notifications.length; i++) {
                await this.hashList.setHash('read:' + userId, notifications[i].id, markValue);
                await this.hashList.setHash('shown:' + userId, notifications[i].id, true);
            }

            if (markValue)
                await this.hashList.setHash('infoHash:'+userId, 'unread', 0); //all has been read
            else
                await this.hashList.setHash('infoHash:'+userId, 'unread', await this.list.listLength(userId)); //none has been read

            return {result: true}
        }

        await this.hashList.setHash('read:'+userId, notificationId, markValue);
        await this.hashList.setHash('shown:'+userId, notificationId, true);
        await this.hashList.incrementBy('infoHash:'+userId, 'unread', (markValue ? -1 : +1) ); // I have read/unread one notification

        return {result: true}
    }

    async markNotificationShown(userAuthenticated, notificationId){

        if (userAuthenticated === null) return {result: false, message: 'You are not authenticated'}

        if (typeof notificationId === 'object') notificationId = notificationId.id;

        let userId =  userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        await this.hashList.setHash('shown:'+userId, notificationId, true);

        return {result:true}
    }

    async resetNotificationsUnreadCounter(userAuthenticated){

        if (userAuthenticated === null) return { result: false,  message: 'You are not authenticated' }

        let userId =  userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        await this.hashList.setHash('infoHash:'+userId, 'unread', 0 ); // I have read/unread one notification

        return { result: true }
    }

    async getReadNotificationStatus(userAuthenticated, notificationId){
        let userId =  userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        return this.hashList.getHash('read:'+userId,notificationId);
    }

    async getUnreadNotifications(userAuthenticated){
        let userId =  userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        return parseInt(await this.hashList.getHash('infoHash:'+userId, 'unread' ));
    }

    async getShownNotificationStatus(userAuthenticated, notificationId){
        let userId =  userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        return this.hashList.getHash('shown:'+userId, notificationId);
    }

    async createNewUserNotification(userId, template, params){

        if (typeof userId === 'object') userId = userId.id;

        let newNotification = new Notification({
            id: nohmIterator.generateCommonIterator(function(){},"notification"),
            dtCreation:  new Date().getTime(),
            authorId: userId,
            template: template,
            seen: false,
            params:  params,
        });

        await this.list.listLeftPush(userId, newNotification.toJSON_REDIS());

        if (await this.list.listLength(userId) > NOTIFICATIONS_DB_MAXIMUM){
            let removed = await this.list.listRightPop(userId);
            let removedNotification = new Notification(JSON.parse(removed));

            //check if old notification is unread, then decrement by the unread by 1...
            let removedNotificationRead = this.hashList.getHash('read:'+userId, removedNotification.id);
            if (removedNotificationRead !== true)
                await this.hashList.incrementBy('infoHash:'+userId, 'unread', -1);

            this.hashList.deleteHash('read:'+userId,removedNotification.id);
            this.hashList.deleteHash('shown:'+userId,removedNotification.id);
            //await this.list.listTrim(userId, 0, NOTIFICATIONS_DB_MAXIMUM-1);
        }

        await this.hashList.incrementBy('infoHash:'+userId, 'unread', 1);


        return newNotification;
    }

    createNewUserNotificationFromUser(userId,  template, objectId, userSourceId, title, body, anchor, image){

        if (typeof userSourceId === 'object') userSourceId =  userSourceId.id;

        title = SanitizeAdvanced.sanitizeStripAllTags(title);
        body = SanitizeAdvanced.sanitizeStripAllTags(body);

        if (title.length > 50) title = title.substr(0,50)+'...';
        if (body.length > 40) body = body.substr(0,40)+'...';

        return this.createNewUserNotification(userId, template, {
            userSourceId: userSourceId,
            objectId: objectId,
            title: title,
            body: body,
            anchor: anchor,
            image: image,
        });

    }

    async test(){

        console.log('createNewUserNotificationFromUser', await this.createNewUserNotificationFromUser('user1','template','111','userX','TITLU','TEXT','IMAGE'));
        console.log('createNewUserNotificationFromUser', await this.createNewUserNotificationFromUser('user1','template','111','userY','TITLU2','TEXT2','IMAGE2'));

        for (let i=0; i< 120; i++){
            console.log('createNewUserNotificationFromUser', await this.createNewUserNotificationFromUser('user1','template','111','user'+i,'TITLU2','TEXT2','IMAGE2'));
        }

        await this.markNotificationRead('user1','user55', true, true);
        await this.markNotificationRead('user1','user55', false, false);

        console.log('createNewUserNotificationFromUser', await this.createNewUserNotificationFromUser('1_user_14987719886059997','template','111','userY','TITLU2','TEXT2','IMAGE2'));

        let userId = '1_user_14979557751049105';

        console.log('createNewUserNotificationFromUser', await this.createNewUserNotificationFromUser(userId,'template','111','1_user_14987719886059997','TITLU'+await this.list.listLength(userId),'TEXT2','IMAGE2'));

        //console.log('getUserNotifications', await this.getUserNotifications('user1', 1, 8));

    }


}

module.exports = new NotificationsListHelper();