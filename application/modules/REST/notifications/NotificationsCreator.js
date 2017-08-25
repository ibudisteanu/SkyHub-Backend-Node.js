let NotificationsHelper = require ('./notifications/helpers/Notifications.helper.js');
let NotificationsSubscribersHashList = require ('./subscribers/helpers/NotificationsSubscribers.hashlist.js');


class NotificationsCreator {

    newReply(topic, title,  body, image, author, ){

        NotificationsSubscribersHashList.subscribeUserToNotifications(author, topic);

        let users = NotificationsSubscribersHashList.getSubscribedUsersList(author, author);

        for (let i=0; i<users.length; i++){
            let user = users[i];
            NotificationsHelper.createNewUserNotificationFromUser(user, 'new-reply', author, title, body, image);
        }
    }

    newTopic(forum, title, body, image, author, ){

        NotificationsSubscribersHashList.subscribeUserToNotifications(author, forum);

        let users = NotificationsSubscribersHashList.getSubscribedUsersList(author, author);

        for (let i=0; i<users.length; i++){
            let user = users[i];
            NotificationsHelper.createNewUserNotificationFromUser(user, 'new-reply', author, title, body, image);
        }
    }

};


module.exports = new NotificationsCreator();