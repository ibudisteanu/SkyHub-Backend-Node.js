/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/2/2017.
 * (C) BIT TECHNOLOGIES
 */


var List = require ('../../../DB/Redis/lists/List.helper.ts');
var HashList = require ('../../../DB/Redis/lists/HashList.helper.ts');
var commonFunctions = require ('../../common/helpers/common-functions.helper.ts');
var nohmIterator = require ('../../../../DB/Redis/nohm/nohm.iterator.ts');
var Notification = require ('./../models/Notification.model.ts');

class NotificationsList {

    //sortedList
    constructor(){
        this.list = new List("Notifications:list");
        this.hashList = new HashList("Notifications:hash");
    }

    async getUserNotifications(userAuthenticated, pageIndex, pageCount){

        let userId = userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id;

        let answer = await this.list.listRange(userId, (pageIndex-1)*pageCount, pageIndex*pageCount);
        let result = [];
        if (answer !== null){
            for (let i=0; i<answer.length; i++)
                result.push(new Notification(answer[i]));
        }

        return result;

    }

    async createNewUserNotification(userId, template, params){

        if (typeof userId === 'object') userId = userId.id;

        let newNotification = new Notification({
            id: nohmIterator.generateCommonIterator(function(){},"topic"),
            dtCreation:  new Date(),
            authorId: userId,
            template: template,
            params:  params,
        });

        await this.list.listLeftPush(userId, newNotification.id, newNotification);
        await this.hashList.incrementBy(userId, 'unread', 1);

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

    }


}