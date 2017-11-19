/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

import * as redis from 'DB/redis_nohm'

var StatisticsHelper = require ('../REST/statistics/helpers/Statistics.helper.js');

var ForumsHelper = require ('../REST/forums/forums/helpers/Forums.helper.js');
var TopicsHelper = require ('../REST/forums/topics/helpers/Topics.helper.js');
var RepliesHelper = require ('../REST/forums/replies/helpers/Replies.helper.js');
var UsersHelper = require ('../REST/users/auth/helpers/Users.helper.js');

var forumModel = require ('../REST/forums/forums/models/Forum.model.js');
var userModel = require ('../REST/users/auth/models/User.model.js');
var replyModel = require ('../REST/forums/replies/models/Reply.model.js');
var topicModel = require ('../REST/forums/topics/models/Topic.model.js');

let NotificationsCreator = require ('./../REST/notifications/NotificationsCreator.js');
let NotificationsSubscribersHashList = require ('./../REST/notifications/subscribers/helpers/NotificationsSubscribers.hashlist.js');
let AllPagesList = require ('../REST/forums/content/all-pages/helpers/AllPages.list.js');

class AdminController {

    async sort(){

        let forumModelORM = redis.nohm.factory('ForumModel');
        let userModelORM = redis.nohm.factory('UserModel');
        let topicModelORM = redis.nohm.factory('TopicModel');
        let replyModelORM = redis.nohm.factory('ReplyModel');

        await new Promise( (resolve) => {
            forumModelORM.find(async function (err, ids){

                for (let i=0; i<ids.length; i++){
                    let ForumsHelper = require ('../REST/forums/forums/helpers/Forums.helper.js');
                    let index = await ForumsHelper.findForumById(ids[i]);

                    await StatisticsHelper.keepElementSortedList(index.id, index.p('parents'));
                }

                resolve(true);
            }.bind(this) );
        });

        await new Promise( (resolve) => {
            userModelORM.find(async function (err, ids) {

                for (let i = 0; i < ids.length; i++) {
                    let UsersHelper = require ('../REST/users/auth/helpers/Users.helper.js');
                    let index = await UsersHelper.findUserById(ids[i]);
                }

                resolve(true);
            }.bind(this));
        });

        await new Promise( (resolve) => {
            topicModelORM.find(async function (err, ids) {

                for (let i=0; i<ids.length; i++){
                    let TopicsHelper = require ('../REST/forums/topics/helpers/Topics.helper.js');
                    let index = await TopicsHelper.findTopicById(ids[i]);

                    await StatisticsHelper.keepElementSortedList(index.id, index.p('parents'));
                }


                resolve(true);
            }.bind(this));
        });

        await new Promise( (resolve) => {
            replyModelORM.find(async function (err, ids){

                for (let i=0; i<ids.length; i++){

                    let RepliesHelper = require ('../REST/forums/replies/helpers/Replies.helper.js');
                    let index = await RepliesHelper.findReplyById(ids[i]);

                    await StatisticsHelper.keepElementSortedList(index.id, index.p('parents'));
                }

                resolve(true);
            }.bind(this) );
        });

    }

    async replaceUploadedFilesSubstring(substrToReplace, substrReplace){

        let forumModelORM = redis.nohm.factory('ForumModel');
        let userModelORM = redis.nohm.factory('UserModel');
        let topicModelORM = redis.nohm.factory('TopicModel');
        let replyModelORM = redis.nohm.factory('ReplyModel');

        await new Promise( (resolve) => {
            forumModelORM.find(async function (err, ids){

                for (let i=0; i<ids.length; i++){
                    let ForumsHelper = require ('../REST/forums/forums/helpers/Forums.helper.js');
                    let forum = await ForumsHelper.findForumById(ids[i]);

                    if (forum !== null){

                        forum.p('iconPic', forum.p('iconPic').replace(substrToReplace, substrReplace));
                        forum.p('coverPic', forum.p('coverPic').replace(substrToReplace, substrReplace));

                        forum.save(async function (err) {
                            if (err) {
                                console.log("==> Error Saving Forum");
                                console.log(forum.errors); // the errors in validation
                            } else {
                                console.log("Saving Forum Successfully");
                            }
                        }.bind(this));
                    }

                }


                resolve(true);
            }.bind(this) );
        });

        await new Promise( (resolve) => {
            userModelORM.find(async function (err, ids) {

                for (let i = 0; i < ids.length; i++) {
                    let UsersHelper = require ('../REST/users/auth/helpers/Users.helper.js');
                    let user = await UsersHelper.findUserById(ids[i]);

                    if (user !== null){

                        user.p('profilePic', user.p('profilePic').replace(substrToReplace, substrReplace));
                        user.p('coverPic', user.p('coverPic').replace(substrToReplace, substrReplace));

                        user.save(async function (err) {

                            if (err) {
                                console.log("==> Error Saving User");
                                console.log(user.errors); // the errors in validation
                            } else {
                                console.log("Saving User Successfully");
                            }

                        }.bind(this));
                    }

                }

                resolve(true);
            }.bind(this));
        });

        await new Promise( (resolve) => {

            topicModelORM.find(async function (err, ids) {

                for (let i=0; i<ids.length; i++){
                    let TopicsHelper = require ('../REST/forums/topics/helpers/Topics.helper.js');
                    let topic = await TopicsHelper.findTopicById(ids[i]);

                    if (topic !== null){

                        let attachments = topic.p('attachments');

                        if (attachments !== null) {


                            console.log("attachments", attachments);

                            for (let i = 0; i < attachments.length; i++) {
                                attachments[i]['url'] = attachments[i]['url'].replace(substrToReplace, substrReplace);
                                attachments[i]['img'] = attachments[i]['img'].replace(substrToReplace, substrReplace);
                            }

                            topic.p('attachments', attachments);

                            topic.save(async function (err) {

                                if (err) {
                                    console.log("==> Error Saving Topic");
                                    console.log(topic.errors); // the errors in validation
                                } else {
                                    console.log("Saving Topic Successfully");
                                }

                            }.bind(this));

                        }

                    }

                }


                resolve(true);

            }.bind(this));
        });


        await new Promise( (resolve) => {
            replyModelORM.find(async function (err, ids){

                for (let i=0; i<ids.length; i++){

                    let RepliesHelper = require ('../REST/forums/replies/helpers/Replies.helper.js');
                    let reply = await RepliesHelper.findReplyById(ids[i]);

                    if (reply !== null){

                        let attachments = reply.p('attachments');

                        if (attachments !== null) {
                            for (let i = 0; i < attachments.length; i++) {
                                attachments[i]['url'] = attachments[i]['url'].replace(substrToReplace, substrReplace);
                                attachments[i]['img'] = attachments[i]['img'].replace(substrToReplace, substrReplace);
                            }

                            reply.p('attachments', attachments);

                            reply.save(async function (err) {

                                if (err) {
                                    console.log("==> Error Saving Reply");
                                    console.log(reply.errors); // the errors in validation
                                } else {
                                    console.log("Saving Reply Successfully");
                                }

                            }.bind(this));

                        }

                    }


                }

                resolve(true);
            }.bind(this) );
        });

    }


    async buildAllPagesLists(){
        let forumModelORM = redis.nohm.factory('ForumModel');
        let topicModelORM = redis.nohm.factory('TopicModel');


        await new Promise( (resolve) => {
            forumModelORM.find(async function (err, ids){

                let ForumsHelper = require ('../REST/forums/forums/helpers/Forums.helper.js');

                //Deleting previous data
                for (let i=0; i<ids.length; i++){
                    let forum = await ForumsHelper.findForumById(ids[i]);
                    if (forum !== null) await AllPagesList.deleteAllPagesList(forum.id);
                }
                await AllPagesList.deleteAllPagesList(''); //delete the home page as well

                for (let i=0; i<ids.length; i++){
                    let forum = await ForumsHelper.findForumById(ids[i]);

                    if (forum !== null)
                        await AllPagesList.keepAllPagesList(forum.p('parentId'), forum.p('URL'), false);
                }

                resolve(true);
            }.bind(this) );
        });

        await new Promise( (resolve) => {
            topicModelORM.find(async function (err, ids) {

                let TopicsHelper = require ('../REST/forums/topics/helpers/Topics.helper.js');
                for (let i=0; i<ids.length; i++){
                    let topic = await TopicsHelper.findTopicById(ids[i]);

                    if (topic !== null)
                        await AllPagesList.keepAllPagesList(topic.p('parentId'), topic.p('URL'), false);

                }

                resolve(true);
            }.bind(this));
        });
    }


    async buildNotificationsSubscribersLists(){


        let forumModelORM = redis.nohm.factory('ForumModel');
        let topicModelORM = redis.nohm.factory('TopicModel');
        let replyModelORM = redis.nohm.factory('ReplyModel');

        await new Promise( (resolve) => {
            forumModelORM.find(async function (err, ids){

                let ForumsHelper = require ('../REST/forums/forums/helpers/Forums.helper.js');
                for (let i=0; i<ids.length; i++){
                    let forum = await ForumsHelper.findForumById(ids[i]);

                    if (forum !== null)
                        NotificationsSubscribersHashList.subscribeUserToNotifications(forum.p('authorId'), forum, true);
                }

                resolve(true);
            }.bind(this) );
        });

        await new Promise( (resolve) => {
            topicModelORM.find(async function (err, ids) {

                let TopicsHelper = require ('../REST/forums/topics/helpers/Topics.helper.js');
                for (let i=0; i<ids.length; i++){
                    let topic = await TopicsHelper.findTopicById(ids[i]);

                    if (topic !== null)
                        NotificationsSubscribersHashList.subscribeUserToNotifications(topic.p('authorId'), topic, true);

                }


                resolve(true);

            }.bind(this));
        });

        await new Promise( (resolve) => {
            replyModelORM.find(async function (err, ids){

                let RepliesHelper = require ('../REST/forums/replies/helpers/Replies.helper.js');
                for (let i=0; i<ids.length; i++){
                    let reply = await RepliesHelper.findReplyById(ids[i]);

                    if (reply !== null)
                        NotificationsSubscribersHashList.subscribeUserToNotifications(reply.p('authorId'), reply.p('parentId'), true);

                }

                resolve(true);
            }.bind(this) );
        });

    }
}


module.exports = new AdminController();