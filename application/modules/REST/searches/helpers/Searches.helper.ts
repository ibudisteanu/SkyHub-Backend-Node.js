/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

var SearchList = require('../../../DB/Redis/lists/search/SearchList.helper.ts');

var forumModel = require ('./../../forums/forums/models/Forum.model.ts');
var userModel = require ('./../../auth/models/User.model.ts');
var replyModel = require ('./../../forums/replies/models/Reply.model.ts');
var topicModel = require ('./../../forums/topics/models/Topic.model.ts');



var ForumsHelper = require ('./../../forums/forums/helpers/Forums.helper.ts');
var TopicsHelper = require ('./../../forums/topics/helpers/Topics.helper.ts');
var RepliesHelper = require ('./../../forums/replies/helpers/Replies.helper.ts');
var UsersHelper = require ('./../../auth/helpers/Users.helper.ts');

class Searches {

    //sortedList
    constructor(){
        this.searchList = new SearchList("None");
    }

    async addContent(text, index, score){
        this.searchList.setNewTablePrefix("Content");
        return await this.searchList.createSearchPrefixes(text, index, score);
    }

    async addUserToSearch(text, index, score){

        if (text === null ){

            let user = index;
            if (typeof index === "string") {
                var UsersHelper = require ('./../../auth/helpers/Users.helper.ts');
                user = await UsersHelper.findUserById(index);
            }

            if (user !== null) {
                text = user.p('username') + ' ' + user.getFullName();
                score = user.calculateHotnessCoefficient();
            }
        }

        console.log("@@@@@@@@@@@@@@@@@@@@ addUserToSearch ", text, index);

        await this.addContent(text, index, score);

        this.searchList.setNewTablePrefix("Users");
        return await this.searchList.createSearchPrefixes(text, index, score);
    }

    async addForumToSearch(text, index, score){

        if (text === null ){

            let forum = index;
            if (typeof index === "string"){
                var ForumsHelper = require ('./../../forums/forums/helpers/Forums.helper.ts');
                forum = await ForumsHelper.findForumById(index);
            }

            if (forum !== null) {
                text = forum.p('name');
                score = forum.calculateHotnessCoefficient();
            }
        }

        console.log("@@@@@@@@@@@@@@@@@@@@ addForumToSearch ", text, index);

        await this.addContent(text, index, score);

        this.searchList.setNewTablePrefix("Forums");
        return await this.searchList.createSearchPrefixes(text, index, score);
    }

    async addTopicToSearch(text, index, score){

        if (text === null ){

            let topic = index;
            if (typeof index === "string"){
                var TopicsHelper = require ('./../../forums/topics/helpers/Topics.helper.ts');
                topic = await TopicsHelper.findTopicById(index);
            }

            if (topic !== null) {
                text = topic.p('title');
                score = topic.calculateHotnessCoefficient();
            }
        }

        await this.addContent(text, index, score);

        this.searchList.setNewTablePrefix("Topics");
        return await this.searchList.createSearchPrefixes(text, index, score);
    }

    async addReplyToSearch(text, index, score){

        if (text === null ){

            let reply = index;
            if (typeof index === "string")  {
                var RepliesHelper = require ('./../../forums/replies/helpers/Replies.helper.ts');
                reply = await RepliesHelper.findReplyById(index);
            }

            if (reply !== null) {
                text = reply.p('title');
                score = reply.calculateHotnessCoefficient();
            }
        }

        console.log('reply',text, index, score);

        await this.addContent(text, index, score);

        this.searchList.setNewTablePrefix("Replies");
        return await this.searchList.createSearchPrefixes(text, index, score);
    }

    async searchParents(text){

        this.searchList.setNewTablePrefix("Forums");
        return await this.searchList.searchPhrase(text);
    }

    async buildSearchTables(){

        let forumModelORM = redis.nohm.factory('ForumModel');
        let userModelORM = redis.nohm.factory('UserModel');
        let topicModelORM = redis.nohm.factory('TopicModel');
        let replyModelORM = redis.nohm.factory('ReplyModel');

        let parent = this;


        let promise = new Promise( (resolve) => {
            forumModelORM.find(async function (err, ids){

                for (let i=0; i<ids.length; i++)
                    await this.addForumToSearch(null,ids[i], 0);

                resolve(true);
            }.bind(this) );
        });

        await promise;

        promise = new Promise( (resolve) => {
            userModelORM.find(async function (err, ids) {

                for (let i = 0; i < ids.length; i++)
                    await this.addUserToSearch(null, ids[i], 0);

                resolve(true);
            }.bind(this));
        });

        await promise;

        promise = new Promise( (resolve) => {
            topicModelORM.find(async function (err, ids) {
                for (let i = 0; i < ids.length; i++)
                    await this.addTopicToSearch(null, ids[i], 0);

                resolve(true);
            }.bind(this));
        });

        await promise;

        promise = new Promise( (resolve) => {
            replyModelORM.find(async function (err, ids){
                for (let i=0; i<ids.length; i++)
                    await this.addReplyToSearch(null,ids[i], 0);

                resolve(true);
            }.bind(this) );
        });

        await promise;

    }

    async test(){

    }

};

module.exports = new Searches();