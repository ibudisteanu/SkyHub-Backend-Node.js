/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/2/2017.
 * (C) BIT TECHNOLOGIES
 */


var HashList = require ('../../../../DB/Redis/lists/HashList.helper.js');
var NotificationSubscriberType = require ('../models/NotificationSubscriberType.js');

class NotificationsSubscribersList {

    //List
    constructor(){
        this.hashList = new HashList("NotificationsSubscribers");
    }

    subscribeUserToNotifications(user, object, forceSubscribe){

        if (typeof forceSubscribe === 'undefined') forceSubscribe = false;

        if ((typeof user === 'undefined')||(user === null)) return null;
        if ((typeof object === 'undefined')||((object === null))) return null;

        if (typeof user === 'object') user = user.id;
        if (typeof object === 'object')  object = object.id;

        let hash = this.hashList.getHash(object,user);

        if ((hash === null)||(forceSubscribe)){
            this.hashList.setHash(object,user, NotificationSubscriberType.NOTIFICATIONS_SUBSCRIBED);
            return true;
        }

        return false;
    }

    unsubscribeUserFromNotifications(user, object){
        if ((typeof user === 'undefined')||(user === null)) return false;
        if ((typeof object === 'undefined')||((object === null))) return false;

        if (typeof user === 'object') user = user.id;
        if (typeof object === 'object')  object = object.id;

        let hash = this.hashList.getHash(object,user);
        if (hash === null) return true;

        if (hash === NotificationSubscriberType.NOTIFICATIONS_SUBSCRIBED){
            this.hashList.setHash(object, user, NotificationSubscriberType.NOTIFICATIONS_UNSUBSCRIBED);
        }
    }

    getSubscribedUsersList(object, exceptUser){
        if ((typeof object === 'undefined')||((object === null))) return [];
        if (typeof object === 'object')  object = object.id;

        if (typeof exceptUser === 'object') exceptUser = exceptUser.id;
        if (typeof exceptUser === 'undefined') exceptUser = null;

        let result = this.hashList.getAllHash(object);

        if (result === null) result = [];
        else {
            for (let i=result.length-1; i>=0; i--)
                if (result[i] === exceptUser)
                    result.splice(i,1);
        }

        return result;
    }

}

module.exports = new NotificationsSubscribersList();