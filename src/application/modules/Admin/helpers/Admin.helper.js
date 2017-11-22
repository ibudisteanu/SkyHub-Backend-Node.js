/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

import * as redis from 'DB/redis_nohm'
import constants from 'bin/constants'

import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

import StatisticsHelper from 'REST/statistics/helpers/Statistics.helper.js';

let ForumsHelper = require ('REST/forums/forums/helpers/Forums.helper.js');
let TopicsHelper = require ('REST/forums/topics/helpers/Topics.helper.js');
let RepliesHelper = require ('REST/forums/replies/helpers/Replies.helper.js');
import UsersHelper from 'REST/users/auth/helpers/Users.helper'

let forumModel = require ('REST/forums/forums/models/Forum.model.js');
let userModel = require ('REST/users/auth/models/User.model.js');
let replyModel = require ('REST/forums/replies/models/Reply.model.js');
let topicModel = require ('REST/forums/topics/models/Topic.model.js');

let forumModelORM = redis.nohm.factory('ForumModel');
let userModelORM = redis.nohm.factory('UserModel');
let topicModelORM = redis.nohm.factory('TopicModel');
let replyModelORM = redis.nohm.factory('ReplyModel');

import NotificationsCreator from 'REST/notifications/NotificationsCreator'
import NotificationsSubscribersHashList from 'REST/notifications/subscribers/helpers/NotificationsSubscribers.hashlist'
import AllPagesList from 'REST/forums/content/all-pages/helpers/AllPages.list'

class AdminHelper {

    async sort(userAuthenticated){

        if (userAuthenticated === null || userAuthenticated.isAdmin === false) return {result:false, message:"You are not ADMIN"};

        await new Promise( (resolve) => {
            forumModelORM.find(async (err, ids) =>{

                for (let i=0; i<ids.length; i++){

                    let index = await ForumsHelper.findForumById(ids[i]);

                    await StatisticsHelper.keepElementSortedList(index.id, index.p('parents'));
                }

                resolve(true);
            } );
        });

        await new Promise( (resolve) => {
            userModelORM.find(async (err, ids) => {

                for (let i = 0; i < ids.length; i++) {

                    let index = await UsersHelper.findUserById(ids[i]);
                }

                resolve(true);
            });
        });

        await new Promise( (resolve) => {
            topicModelORM.find(async (err, ids) => {

                for (let i=0; i<ids.length; i++){

                    let index = await TopicsHelper.findTopicById(ids[i]);

                    await StatisticsHelper.keepElementSortedList(index.id, index.p('parents'));
                }


                resolve(true);
            });
        });

        await new Promise( (resolve) => {
            replyModelORM.find(async (err, ids) => {

                for (let i=0; i<ids.length; i++){

                    let index = await RepliesHelper.findReplyById(ids[i]);

                    await StatisticsHelper.keepElementSortedList(index.id, index.p('parents'));
                }

                resolve(true);
            });
        });

        return {result: true, message: "Sort has been done"}

    }

    async replaceUploadedFilesSubstring(userAuthenticated, substrToReplace, substrReplace){


        if (userAuthenticated === null || userAuthenticated.isAdmin === false) return {result:false, message:"You are not ADMIN"};

        await new Promise( (resolve) => {
            forumModelORM.find(async  (err, ids) => {

                for (let i=0; i<ids.length; i++){

                    let forum = await ForumsHelper.findForumById(ids[i]);

                    if (forum !== null){

                        forum.p('iconPic', forum.p('iconPic').replace(substrToReplace, substrReplace));
                        forum.p('coverPic', forum.p('coverPic').replace(substrToReplace, substrReplace));

                        forum.save(async (err) => {
                            if (err) {
                                console.log("==> Error Saving Forum");
                                console.log(forum.errors); // the errors in validation
                            } else {
                                console.log("Saving Forum Successfully");
                            }
                        });
                    }

                }


                resolve(true);
            } );
        });

        await new Promise( (resolve) => {
            userModelORM.find(async (err, ids) => {

                for (let i = 0; i < ids.length; i++) {

                    let user = await UsersHelper.findUserById(ids[i]);

                    if (user !== null){

                        user.p('profilePic', user.p('profilePic').replace(substrToReplace, substrReplace));
                        user.p('coverPic', user.p('coverPic').replace(substrToReplace, substrReplace));

                        user.save(async (err) =>{

                            if (err) {
                                console.log("==> Error Saving User");
                                console.log(user.errors); // the errors in validation
                            } else {
                                console.log("Saving User Successfully");
                            }

                        });
                    }

                }

                resolve(true);
            });
        });

        await new Promise( (resolve) => {

            topicModelORM.find(async (err, ids) => {

                for (let i=0; i<ids.length; i++){

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

                            topic.save(async (err) => {

                                if (err) {
                                    console.log("==> Error Saving Topic");
                                    console.log(topic.errors); // the errors in validation
                                } else {
                                    console.log("Saving Topic Successfully");
                                }

                            });

                        }

                    }

                }


                resolve(true);

            });
        });


        await new Promise( (resolve) => {
            replyModelORM.find(async (err, ids) =>{

                for (let i=0; i<ids.length; i++){


                    let reply = await RepliesHelper.findReplyById(ids[i]);

                    if (reply !== null){

                        let attachments = reply.p('attachments');

                        if (attachments !== null) {
                            for (let i = 0; i < attachments.length; i++) {
                                attachments[i]['url'] = attachments[i]['url'].replace(substrToReplace, substrReplace);
                                attachments[i]['img'] = attachments[i]['img'].replace(substrToReplace, substrReplace);
                            }

                            reply.p('attachments', attachments);

                            reply.save(async (err) => {

                                if (err) {
                                    console.log("==> Error Saving Reply");
                                    console.log(reply.errors); // the errors in validation
                                } else {
                                    console.log("Saving Reply Successfully");
                                }

                            });

                        }

                    }


                }

                resolve(true);
            });
        });

        return {result: true, message: "replaceUploadedFilesSubstring done"}

    }


    async buildAllPagesLists(userAuthenticated){

        if (userAuthenticated === null || userAuthenticated.isAdmin === false) return {result:false, message:"You are not ADMIN"};

        await new Promise( (resolve) => {
            forumModelORM.find(async (err, ids) => {



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
            });
        });

        await new Promise( (resolve) => {
            topicModelORM.find(async (err, ids) => {


                for (let i=0; i<ids.length; i++){
                    let topic = await TopicsHelper.findTopicById(ids[i]);

                    if (topic !== null)
                        await AllPagesList.keepAllPagesList(topic.p('parentId'), topic.p('URL'), false);

                }

                resolve(true);

                return {result: true, message:"buildAllPagesLists done"}
            });
        });

    }


    async buildNotificationsSubscribersLists(userAuthenticated){

        if (userAuthenticated === null || userAuthenticated.isAdmin === false) return {result:false, message:"You are not ADMIN"};

        await new Promise( (resolve) => {
            forumModelORM.find(async (err, ids) => {


                for (let i=0; i<ids.length; i++){
                    let forum = await ForumsHelper.findForumById(ids[i]);

                    if (forum !== null)
                        NotificationsSubscribersHashList.subscribeUserToNotifications(forum.p('authorId'), forum, true);
                }

                resolve(true);
            });
        });

        await new Promise( (resolve) => {
            topicModelORM.find(async (err, ids) => {


                for (let i=0; i<ids.length; i++){
                    let topic = await TopicsHelper.findTopicById(ids[i]);

                    if (topic !== null)
                        NotificationsSubscribersHashList.subscribeUserToNotifications(topic.p('authorId'), topic, true);

                }


                resolve(true);

            });
        });

        await new Promise( (resolve) => {
            replyModelORM.find(async (err, ids) => {


                for (let i=0; i<ids.length; i++){
                    let reply = await RepliesHelper.findReplyById(ids[i]);

                    if (reply !== null)
                        NotificationsSubscribersHashList.subscribeUserToNotifications(reply.p('authorId'), reply.p('parentId'), true);

                }

                resolve(true);

                return {result: true, message:"buildNotificationsSubscribersLists done"}
            });
        });

    }

    async copyDB(userAuthenticated, dbSource, dbDestination){

        console.log(userAuthenticated);
        console.log(userAuthenticated.isAdmin);

        if (userAuthenticated === null || userAuthenticated.isAdmin === false) return {result:false, message:"You are not ADMIN"};

        if (typeof dbSource === 'undefined') dbSource = constants.DB_REDIS_CURRENT_DB;
        if (typeof dbDestination === 'undefined') dbDestination = 5;

        console.log("keys..");

        let redisClient = null;

        try{
            const redis = require('redis');
            redisClient = redis.createClient(constants.DB_REDIS_PORT, constants.DB_REDIS_HOST, {password: constants.DB_REDIS_PASSWORD}); //creates a new client

        }catch (exception) {
            console.error("============== ERROR REDIS CLIENT");
        }

        return new Promise((resolve)=> {

            redisClient.on('connect', () => {
                console.log('===> REDIS connected\n');

                redisClient.select(dbSource, (err, res) => {
                    if (err)
                        resolve ({message:"====> REDIS couldn't select redis DB " + dbSource });
                    else {
                        console.log('====> REDIS selecting worked')
                        console.log("===> NOHM - setting REDIS CLIENT");

                        redisClient.keys('*' , async (err, keys) =>{
                            console.log("keys answer", keys);

                            if (keys.length === 0)
                                return ({message: "Database "+dbSource+" is empty"});

                            await new Promise((resolve2)=> {
                                for (let i = 0; i < keys.length; i++) {

                                    let key = keys[i];

                                    redisClient.migrate(constants.DB_REDIS_HOST, constants.DB_REDIS_PORT, key, dbDestination, 100000, true, (err, answer) => {
                                        console.log("migrated ", key, answer);

                                        if (i === keys.length-1) resolve2(true)
                                    })

                                }

                            });

                            resolve ({message:"Database successfully copied from "+dbSource+" to "+dbDestination});
                        });
                    }
                });

            });
        });



    }
}


export default new AdminHelper();