/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */

/**
 * Created by BIT TECHNOLOGIES on 6/1/2017.
 */

var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var SessionsHashList = require ('./SessionsHashList.helper.ts');

var hat = require('hat');

class SessionsHash {

    //sortedList
    constructor(){
        this.hashList = new HashList("Sessions");
    }

    async checkSession(sessionId){
        return this.hashList.getHash('',sessionId);
    }

    async createSession(UserAuthenticated){

        let userId = this.getUserId(UserAuthenticated);

        if (userId === '') return false;

        let sessionId = hat();
        return this.hashList.setHash('',sessionId,userId);
    }

    async deleteSession(sessionId, UserAuthenticated){
        let userId = this.getUserId(UserAuthenticated);

        if (userId === '') return false;

        return this.hashList.deleteHash('',sessionId);
    }

    async clearAllSessions(UserAuthenticated){

        let userId = this.getUserId(UserAuthenticated);

        if (userId === '') return false;

        return this.hashList
    }

    getUserId(UserAuthenticated){
        let userId = '';
        if (typeof UserAuthenticated === "string") userId = UserAuthenticated;
        else
        if (typeof UserAuthenticated === "object"){

            if (UserAuthenticated.hasOwnProperty('id'))
                userId = UserAuthenticated.id;
            else
            if ((UserAuthenticated.hasOwnProperty('user'))&&(UserAuthenticated.user.hasOwnProperty('id')))
                userId = UserAuthenticated.user.id;
        }
    }

    async test(){

        this.sortedList.addElement("",33,"Salut1");
        this.sortedList.addElement("",55,"Salut2");
        this.sortedList.addElement("",66,"Salut3");
        this.sortedList.addElement("",626,"Salut4");
        this.sortedList.addElement("",26,"Salut5");
        this.sortedList.addElement("",15,"Salut6");
        this.sortedList.addElement("",6,"Salut7");

        console.log("DELETE Salut4 ",await this.sortedList.deleteElement("","Salut4"));

        console.log("UPDATE SALUT3", await this.sortedList.updateElement("",2666,"Salut3"));


        console.log("rank1", await this.sortedList.getRankItem("","Salut5"));
        console.log("rank1", await this.sortedList.getRankItem("","Salut3"));
        console.log("COUNT LIST: ",await this.sortedList.countList(""));

        console.log("COUNT LIST BETWEEN ", await this.sortedList.countListBetweenMinMax("",50,400));


        console.log("GET ITEMS   ", await this.sortedList.getItemsMatching(""));


        console.log("GET LIST RANGE BY SORTED INDEX ", await this.sortedList.getListRangeBySortedIndex("",1,5));

        console.log("GET LIST RANGE BY SCORE ", await this.sortedList.getListRangeByScore("",30,600));

    }

};

module.exports = new TopContent();