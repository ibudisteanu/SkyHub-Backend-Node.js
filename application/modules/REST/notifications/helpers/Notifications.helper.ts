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


var List = require ('../../../DB/Redis/lists/List.helper.ts');
var HashList = require ('../../../DB/Redis/lists/HashList.helper.ts');
var commonFunctions = require ('../../common/helpers/common-functions.helper.ts');
var nohmIterator = require ('../../../DB/Redis/nohm/nohm.iterator.ts');
var Notification = require ('./../models/Notification.model.ts');

const NOTIFICATIONS_DB_MAXIMUM = 100;

class NotificationsListHelper {

    //sortedList
    constructor(){
        this.list = new List("Notifications:list");
        this.hashList = new HashList("Notifications");
    }

    async getUserNotifications(userAuthenticated, pageIndex, pageCount){
        if (typeof pageCount === 'undefined') pageCount = 8;
        pageCount = Math.min(pageCount, 20);

        let userId = userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        let answer = await this.list.listRange(userId, (pageIndex-1)*pageCount, pageIndex*pageCount);
        let result = [];

        console.log('#####',answer);

        if (answer !== null){
            for (let i=0; i<answer.length; i++) {
                let obj = JSON.parse(answer[i]); //the data in the DB is stringified
                let notification = new Notification(obj);

                notification.read = await this.getReadNotification(userAuthenticated, notification.id);

                result.push(notification);
            }
        }

        return result;
    }

    async markNotification(userAuthenticated, notificationId, markAll, markValue){

        if (typeof markValue === 'undefined') readValue = true;
        if (typeof notificationId === 'object') notificationId = notificationId.id;

        let userId =  userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        if (markAll){
            let notifications = await this.list.listRange(userId,0, NOTIFICATIONS_DB_MAXIMUM-1);

            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@ notifications', notifications);

            for (let i=0; i<notifications.length; i++) {
                notifications[i] = new Notification(JSON.parse(notifications[i]));
            }

            for (let i=0; i<notifications.length; i++)
                await this.hashList.setHash('read:'+userId, notifications[i].id, markValue);

            if (markValue)
                await this.hashList.setHash('infoHash:'+userId, 'unread', 0); //all has been read
            else
                await this.hashList.setHash('infoHash:'+userId, 'unread', await this.list.listLength(userId)); //none has been read

            return true;
        }

        await this.hashList.setHash('read:'+userId, notificationId, markValue);
        await this.hashList.incrementBy('infoHash:'+userId, 'unread', (markValue ? -1 : +1) ); // I have read/unread one notification

        return true;
    }

    async getReadNotification(userAuthenticated, notificationId){
        let userId =  userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        return this.hashList.getHash('read:'+userId,notificationId);
    }

    async createNewUserNotification(userId, template, params){

        if (typeof userId === 'object') userId = userId.id;

        let newNotification = new Notification({
            id: nohmIterator.generateCommonIterator(function(){},"topic"),
            dtCreation:  new Date(),
            authorId: userId,
            template: template,
            seen: false,
            params:  params,
        });

        await this.list.listLeftPush(userId, newNotification.toJSON());

        if (await this.list.listLength(userId) > NOTIFICATIONS_DB_MAXIMUM){
            let removed = await this.list.listRightPop(userId);
            let removedNotification = new Notification(JSON.parse(removed));

            //check if old notification is unread, then decrement by the unread by 1...
            let removedNotificationRead = this.hashList.getHash('read:'+userId, removedNotification.id);
            if (removedNotificationRead !== true)
                await this.hashList.incrementBy('infoHash:'+userId, 'unread', -1);

            this.hashList.deleteHash('read:'+userId,removedNotification.id);
            //await this.list.listTrim(userId, 0, NOTIFICATIONS_DB_MAXIMUM-1);
        }

        await this.hashList.incrementBy('infoHash:'+userId, 'unread', 1);


        return newNotification;
    }

    createNewUserNotificationFromUser(userId, template, userSourceId, title, text, image){

        return this.createNewUserNotification(userId, template, {
            userSourceId: userSourceId,
            title: title,
            text: text,
            image: image,
        });

    }

    async test(){

        console.log('createNewUserNotificationFromUser', await this.createNewUserNotificationFromUser('user1','template','userX','TITLU','TEXT','IMAGE'));
        console.log('createNewUserNotificationFromUser', await this.createNewUserNotificationFromUser('user1','template','userY','TITLU2','TEXT2','IMAGE2'));

        for (let i=0; i< 120; i++){
            console.log('createNewUserNotificationFromUser', await this.createNewUserNotificationFromUser('user1','template','user'+i,'TITLU2','TEXT2','IMAGE2'));
        }

        this.markNotification('user1','user55', true, true);
        this.markNotification('user1','user55', false, false);

        //console.log('getUserNotifications', await this.getUserNotifications('user1', 1, 8));

    }


}

module.exports = new NotificationsListHelper();