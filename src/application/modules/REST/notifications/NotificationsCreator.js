let NotificationsHelper = require ('./notifications/helpers/Notifications.helper.js');
let NotificationsSubscribersHashList = require ('./subscribers/helpers/NotificationsSubscribers.hashlist.js');
let MaterializedParentsHelper = require ('DB/common/materialized-parents/MaterializedParents.helper.js');

class NotificationsCreator {

    async newReply(topicId, title,  body, anchor, image, userSourceId, ){

        if (topicId === 'object') topicId = topicId.id;

        NotificationsSubscribersHashList.subscribeUserToNotifications(userSourceId, topicId);

        let users = await NotificationsSubscribersHashList.getSubscribedUsersList(topicId, userSourceId);

        if (users !== null)
            for (let i=0; i<users.length; i++)
                await NotificationsHelper.createNewUserNotificationFromUser(users[i], 'new-reply',  topicId, userSourceId, title, body, anchor, image);
    }

    async newTopic(forumId, title, body, anchor, image, userSourceId, ){

        if (forumId === 'object') forumId = forumId.id;

        NotificationsSubscribersHashList.subscribeUserToNotifications(userSourceId, forumId);

        let users = NotificationsSubscribersHashList.getSubscribedUsersList(userSourceId, userSourceId);

        if (users !== null)
            for (let i=0; i<users.length; i++)
                await NotificationsHelper.createNewUserNotificationFromUser(users[i], 'new-topic', forumId, userSourceId, title, body, anchor, image);
    }

    async newForum(forumId, title, body, anchor, image, userSourceId, ){

        if (forumId === 'object') forumId = forumId.id;

        NotificationsSubscribersHashList.subscribeUserToNotifications(userSourceId, forumId);

        let users = NotificationsSubscribersHashList.getSubscribedUsersList(userSourceId, userSourceId);

        if (users !== null)
            for (let i=0; i<users.length; i++)
                await NotificationsHelper.createNewUserNotificationFromUser(users[i], 'new-forum', forumId, userSourceId, title, body, anchor, image);
    }

    async newVote(voteParentId, userSourceId, voteType){

        if (voteParentId === 'object') voteParentId = voteParentId.id;

        // Calculating the User of the content
        // but first, we need to extract the object
        let objectParentId = voteParentId;
        let parentObject = await MaterializedParentsHelper.findObject(objectParentId);
        if (parentObject !== null){
            let objectAuthorId = parentObject.p('authorId')||parent.authorId||'';
            let objectAnchor = parentObject.p('URL');

            if (objectAuthorId !== '')
                await NotificationsHelper.createNewUserNotificationFromUser(objectAuthorId, 'new-vote', objectParentId, userSourceId, '', '', objectAnchor, '');
        }

    }

};


module.exports = new NotificationsCreator();