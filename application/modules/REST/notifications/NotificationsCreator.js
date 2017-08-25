let NotificationsHelper = require ('./notifications/helpers/Notifications.helper.js');
let NotificationsSubscribersHashList = require ('./subscribers/helpers/NotificationsSubscribers.hashlist.js');


class NotificationsCreator {

    async newReply(topicId, title,  body, anchor, image, author, ){

        if (topicId === 'object') topicId = topicId.id;

        NotificationsSubscribersHashList.subscribeUserToNotifications(author, topicId);

        let users = await NotificationsSubscribersHashList.getSubscribedUsersList(topicId, author);

        if (users !== null)
        for (let i=0; i<users.length; i++){
            let user = users[i];
            await NotificationsHelper.createNewUserNotificationFromUser(user, 'new-reply', topicId, author, title, body, anchor, image);
        }
    }

    async newTopic(forumId, title, body, anchor, image, author, ){

        if (forumId === 'object') forumId = forumId.id;

        NotificationsSubscribersHashList.subscribeUserToNotifications(author, forumId);

        let users = NotificationsSubscribersHashList.getSubscribedUsersList(author, author);

        for (let i=0; i<users.length; i++){
            let user = users[i];
            await NotificationsHelper.createNewUserNotificationFromUser(user, 'new-reply', forumId, author, title, body, anchor, image);
        }
    }

};


module.exports = new NotificationsCreator();