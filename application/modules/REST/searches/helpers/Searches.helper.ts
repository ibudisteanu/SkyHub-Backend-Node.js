/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

var SearchList = require('../../../DB/Redis/lists/search/SearchList.helper.ts');

var forumModel = require ('./../../forums/forums/models/Forum.model.ts');
var ForumsHelper = require ('./../../forums/forums/helpers/Forums.helper.ts');

var userModel = require ('./../../auth/models/User.model.ts');
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

        let user = null;
        if (text === null ){

            if (typeof index === "string")
                user = await UsersHelper.findUserById(index);
            else user =  index;

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

        let forum = null;
        if (text === null ){

            if (typeof index === "string")
                forum = await ForumsHelper.findForumById(index);
            else forum = index;

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

        await this.addContent(text, index, score);

        this.searchList.setNewTablePrefix("Topics");
        return await this.searchList.createSearchPrefixes(text, index, score);
    }

    async searchParents(text){

        this.searchList.setNewTablePrefix("Forums");
        return await this.searchList.searchPhrase(text);
    }

    async buildSearchTables(){

        let forumModelORM = redis.nohm.factory('ForumModel');
        let userModelORM = redis.nohm.factory('UserModel');

        let parent = this;

        forumModelORM.find(function (err, ids){

            let SearchesHelper = require ('./Searches.helper.ts');

            for (let i=0; i<ids.length; i++)
                SearchesHelper.addForumToSearch(null,ids[i], 0);
        });

        userModelORM.find(function (err, ids){

            let SearchesHelper = require ('./Searches.helper.ts');

            for (let i=0; i<ids.length; i++)
                SearchesHelper.addUserToSearch(null,ids[i], 0);
        });

    }

    async test(){

    }

};

module.exports = new Searches();