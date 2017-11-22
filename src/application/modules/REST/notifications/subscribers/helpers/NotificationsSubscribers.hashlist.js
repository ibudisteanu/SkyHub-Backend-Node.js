/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/2/2017.
 * (C) BIT TECHNOLOGIES
 */


import HashList from 'DB/Redis/lists/HashList.helper'
import NotificationSubscriberType from 'REST/notifications/subscribers/models/NotificationSubscriberType.js'

class NotificationsSubscribersList {

    //List
    constructor(){
        this.hashList = new HashList("Notifications:Subscribers");
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

    async getSubscribedUsersList(object, exceptUser){
        if ((typeof object === 'undefined')||((object === null))) return [];
        if (typeof object === 'object')  object = object.id;

        if (typeof exceptUser === 'object') exceptUser = exceptUser.id;
        if (typeof exceptUser === 'undefined') exceptUser = null;

        let arrSubscribers = await this.hashList.getAllHash(object);

        let result = []
        if (arrSubscribers !== null) {

            for(let subscriber in arrSubscribers){

                let subscriberValue = parseInt(arrSubscribers[subscriber]);


                if ((subscriberValue === NotificationSubscriberType.NOTIFICATIONS_SUBSCRIBED )&&(subscriber !== exceptUser)){
                    result.push(subscriber);
                }
            }
        }

        return result;
    }

}

export default new NotificationsSubscribersList();