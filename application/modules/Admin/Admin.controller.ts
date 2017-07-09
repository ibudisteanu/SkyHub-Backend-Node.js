/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var StatisticsHelper = require ('../REST/statistics/helpers/Statistics.helper.ts');

var ForumsHelper = require ('./../REST/forums/forums/helpers/Forums.helper.ts');
var TopicsHelper = require ('./../REST/forums/topics/helpers/Topics.helper.ts');
var RepliesHelper = require ('./../REST/forums/replies/helpers/Replies.helper.ts');
var UsersHelper = require ('../REST/users/auth/helpers/Users.helper.ts');


class AdminController {

    async sort(){

        var forumModel = require ('./../REST/forums/forums/models/Forum.model.ts');
        var userModel = require ('../REST/users/auth/models/User.model.ts');
        var replyModel = require ('./../REST/forums/replies/models/Reply.model.ts');
        var topicModel = require ('./../REST/forums/topics/models/Topic.model.ts');

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
}


module.exports = new AdminController();