/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

import redis from 'DB/redis_nohm'

import SearchList from 'DB/Redis/lists/search/SearchList.helper'


import forumModel from 'REST/forums/forums/models/Forum.model';
import userModel from 'REST/users/auth/models/User.model';
import treplyModel from 'REST/forums/replies/models/Reply.model';
import topicModel from 'REST/forums/topics/models/Topic.model';

import ForumsHelper from 'REST/forums/forums/helpers/Forums.helper';
import TopicsHelper from 'REST/forums/topics/helpers/Topics.helper';
import RepliesHelper from 'REST/forums/replies/helpers/Replies.helper';
import UsersHelper from 'REST/users/auth/helpers/Users.helper'

import ForumsSorter from 'REST/forums/forums/models/ForumsSorter';
import TopicsSorter from 'REST/forums/topics/models/TopicsSorter';
import RepliesSorter from 'REST/forums/replies/models/RepliesSorter';

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
            let ForumsHelper = require ('../../forums/forums/helpers/Forums.helper.js').default;
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
            let TopicsHelper = require ('../../forums/topics/helpers/Topics.helper.js').default;
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
            let RepliesHelper = require('../../forums/replies/helpers/Replies.helper.js').default;
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
            forumModelORM.find(async (err, ids)=>{

                for (let i=0; i<ids.length; i++)
                    await this.addForumToSearch(null,ids[i], 0);

                resolve(true);
            } );
        });

        await promise;

        promise = new Promise( (resolve) => {
            userModelORM.find(async (err, ids) =>{

                for (let i = 0; i < ids.length; i++)
                    await this.addUserToSearch(null, ids[i], 0);

                resolve(true);
            });
        });

        await promise;

        promise = new Promise( (resolve) => {
            topicModelORM.find(async (err, ids) => {
                for (let i = 0; i < ids.length; i++)
                    await this.addTopicToSearch(null, ids[i], 0);

                resolve(true);
            });
        });

        await promise;

        promise = new Promise( (resolve) => {
            replyModelORM.find(async (err, ids) => {
                for (let i=0; i<ids.length; i++)
                    await this.addReplyToSearch(null,ids[i], 0);

                resolve(true);
            });
        });

        await promise;

    }

    async test(){

    }

}

export default new Searches();