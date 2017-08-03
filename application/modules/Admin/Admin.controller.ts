/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var StatisticsHelper = require ('../REST/statistics/helpers/Statistics.helper.ts');

var ForumsHelper = require ('./../REST/forums/forums/helpers/Forums.helper.ts');
var TopicsHelper = require ('./../REST/forums/topics/helpers/Topics.helper.ts');
var RepliesHelper = require ('./../REST/forums/replies/helpers/Replies.helper.ts');
var UsersHelper = require ('../REST/users/auth/helpers/Users.helper.ts');

var forumModel = require ('./../REST/forums/forums/models/Forum.model.ts');
var userModel = require ('../REST/users/auth/models/User.model.ts');
var replyModel = require ('./../REST/forums/replies/models/Reply.model.ts');
var topicModel = require ('./../REST/forums/topics/models/Topic.model.ts');


class AdminController {

    async sort(){


        let forumModelORM = redis.nohm.factory('ForumModel');
        let userModelORM = redis.nohm.factory('UserModel');
        let topicModelORM = redis.nohm.factory('TopicModel');
        let replyModelORM = redis.nohm.factory('ReplyModel');

        let parent = this;


        let promise = new Promise( (resolve) => {
            forumModelORM.find(async function (err, ids){

                for (let i=0; i<ids.length; i++){
                    var ForumsHelper = require ('./../REST/forums/forums/helpers/Forums.helper.ts');
                    let index = await ForumsHelper.findForumById(ids[i]);


                    await StatisticsHelper.keepElementSortedList(index.id, index.p('parents'));
                }


                resolve(true);
            }.bind(this) );
        });

        await promise;

        promise = new Promise( (resolve) => {
            userModelORM.find(async function (err, ids) {

                for (let i = 0; i < ids.length; i++) {
                    var UsersHelper = require ('./../REST/users/auth/helpers/Users.helper.ts');
                    let index = await UsersHelper.findUserById(ids[i]);
                }

                resolve(true);
            }.bind(this));
        });

        await promise;

        promise = new Promise( (resolve) => {
            topicModelORM.find(async function (err, ids) {

                for (let i=0; i<ids.length; i++){
                    var TopicsHelper = require ('./../REST/forums/topics/helpers/Topics.helper.ts');
                    let index = await TopicsHelper.findTopicById(ids[i]);


                    await StatisticsHelper.keepElementSortedList(index.id, index.p('parents'));
                }


                resolve(true);
            }.bind(this));
        });

        await promise;

        promise = new Promise( (resolve) => {
            replyModelORM.find(async function (err, ids){

                for (let i=0; i<ids.length; i++){

                    var RepliesHelper = require ('./../REST/forums/replies/helpers/Replies.helper.ts');
                    let index = await RepliesHelper.findReplyById(ids[i]);


                    await StatisticsHelper.keepElementSortedList(index.id, index.p('parents'));
                }

                resolve(true);
            }.bind(this) );
        });

        await promise;
    }

    async replaceUploadedFilesSubstring(substrToReplace, substrReplace){


        let forumModelORM = redis.nohm.factory('ForumModel');
        let userModelORM = redis.nohm.factory('UserModel');
        let topicModelORM = redis.nohm.factory('TopicModel');
        let replyModelORM = redis.nohm.factory('ReplyModel');

        let parent = this;


        let promise = new Promise( (resolve) => {
            forumModelORM.find(async function (err, ids){

                for (let i=0; i<ids.length; i++){
                    var ForumsHelper = require ('./../REST/forums/forums/helpers/Forums.helper.ts');
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

        await promise;

        promise = new Promise( (resolve) => {
            userModelORM.find(async function (err, ids) {

                for (let i = 0; i < ids.length; i++) {
                    var UsersHelper = require ('./../REST/users/auth/helpers/Users.helper.ts');
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

        await promise;

        promise = new Promise( (resolve) => {

            topicModelORM.find(async function (err, ids) {

                for (let i=0; i<ids.length; i++){
                    var TopicsHelper = require ('./../REST/forums/topics/helpers/Topics.helper.ts');
                    let topic = await TopicsHelper.findTopicById(ids[i]);

                    if (topic !== null){

                        let attachments = topic.p('attachments');

                        if (attachments !== null) {
                            for (let i = 0; i < attachments.left; i++) {
                                attachments[i]['url'].replace(substrToReplace, substrReplace);
                                attachments[i]['img'].replace(substrToReplace, substrReplace);
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

        await promise;

        promise = new Promise( (resolve) => {
            replyModelORM.find(async function (err, ids){

                for (let i=0; i<ids.length; i++){

                    var RepliesHelper = require ('./../REST/forums/replies/helpers/Replies.helper.ts');
                    let reply = await RepliesHelper.findReplyById(ids[i]);

                    if (reply !== null){

                        let attachments = reply.p('attachments');

                        if (attachments !== null) {
                            for (let i = 0; i < attachments.left; i++) {
                                attachments[i]['url'].replace(substrToReplace, substrReplace);
                                attachments[i]['img'].replace(substrToReplace, substrReplace);
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

        await promise;
    }
}


module.exports = new AdminController();