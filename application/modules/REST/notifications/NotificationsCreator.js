let NotificationsHelper = require ('./notifications/helpers/Notifications.helper.js');
let NotificationsSubscribersHashList = require ('./subscribers/helpers/NotificationsSubscribers.hashlist.js');


class NotificationsCreator {

    async newReply(topic, title,  body, anchor, image, author, ){

        NotificationsSubscribersHashList.subscribeUserToNotifications(author, topic);

        let users = await NotificationsSubscribersHashList.getSubscribedUsersList(topic, author);

        console.log("subscribers",users);

        if (users !== null)
        for (let i=0; i<users.length; i++){
            let user = users[i];
            await NotificationsHelper.createNewUserNotificationFromUser(user, 'new-reply', author, title, body, anchor, image);
        }
    }

    async newTopic(forum, title, body, anchor, image, author, ){

        NotificationsSubscribersHashList.subscribeUserToNotifications(author, forum);

        let users = NotificationsSubscribersHashList.getSubscribedUsersList(author, author);

        for (let i=0; i<users.length; i++){
            let user = users[i];
            await NotificationsHelper.createNewUserNotificationFromUser(user, 'new-reply', author, title, body, anchor, image);
        }
    }

};


module.exports = new NotificationsCreator();