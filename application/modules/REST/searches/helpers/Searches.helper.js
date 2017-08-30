/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

let SearchList = require('../../../DB/Redis/lists/search/SearchList.helper.js');

let forumModel = require ('../../forums/forums/models/Forum.model.js');
let userModel = require ('../../users/auth/models/User.model.js');
let replyModel = require ('../../forums/replies/models/Reply.model.js');
let topicModel = require ('../../forums/topics/models/Topic.model.js');

let ForumsHelper = require ('../../forums/forums/helpers/Forums.helper.js');
let TopicsHelper = require ('../../forums/topics/helpers/Topics.helper.js');
let RepliesHelper = require ('../../forums/replies/helpers/Replies.helper.js');
let UsersHelper = require ('../../users/auth/helpers/Users.helper.js');

let ForumsSorter = require('../../forums/forums/models/ForumsSorter.js');
let TopicsSorter = require('../../forums/topics/models/TopicsSorter.js');
let RepliesSorter = require('../../forums/replies/models/RepliesSorter.js');

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

        if (typeof index === "string") {
            let UsersHelper = require ('../../users/auth/helpers/Users.helper.js');
            index = await UsersHelper.findUserById(index);
        }

        if ((index !== null)&&(typeof index === 'object')) {
            text = index.p('username') + ' ' + index.getFullName();
            score = await index.calculateHotnessCoefficient();
        }

        //console.log("@@@@@@@@@@@@@@@@@@@@ addUserToSearch ", text, index);

        await this.addContent(text, index, score);

        this.searchList.setNewTablePrefix("Users");
        return await this.searchList.createSearchPrefixes(text, index, score);
    }

    async addForumToSearch(text, index, score){

        if (typeof index === "string") {
            let ForumsHelper = require ('../../forums/forums/helpers/Forums.helper.js');
            index = await ForumsHelper.findForumById(index);
        }


        if ((index !== null)&&(typeof index === 'object')) {
            text = index.p('name');
            score = await ForumsSorter.getExistingHotnessCoefficient(index.id, index.p('dtCreation'), index.p('parents'));
        }

        //console.log("@@@@@@@@@@@@@@@@@@@@ addForumToSearch ", text, index);

        await this.addContent(text, index, score);

        this.searchList.setNewTablePrefix("Forums");
        return await this.searchList.createSearchPrefixes(text, index, score);
    }

    async addTopicToSearch(text, index, score){

        if (typeof index === "string") {
            let TopicsHelper = require ('../../forums/topics/helpers/Topics.helper.js');
            index = await TopicsHelper.findTopicById(index);
        }

        if ((index !== null)&&(typeof index === 'object')) {
            text = index.p('title');
            score = await TopicsSorter.getExistingHotnessCoefficient(index.id, index.p('dtCreation'), index.p('parents'));
        }

        await this.addContent(text, index, score);

        this.searchList.setNewTablePrefix("Topics");
        return await this.searchList.createSearchPrefixes(text, index, score);
    }

    async addReplyToSearch(text, index, score){

        if (typeof index === "string") {
            let RepliesHelper = require('../../forums/replies/helpers/Replies.helper.js');
            index = await RepliesHelper.findReplyById(index);
        }

        //console.log('add reply to search' , typeof reply, reply !== null);

        if ((index !== null)&&(typeof index === 'object')) {
            text = index.p('title');
            score = await RepliesSorter.getExistingHotnessCoefficient(index.id, index.p('dtCreation'), index.p('parents'));
        }

        //console.log('add reply to search - finally' , text, score);

        console.log('reply',text, score);

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