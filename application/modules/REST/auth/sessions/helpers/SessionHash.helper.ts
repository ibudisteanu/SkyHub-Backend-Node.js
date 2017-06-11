/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */

var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var SessionsHashList = require ('./SessionsHashList.helper.ts');

var hat = require('hat');

class SessionHash {

    //sortedList
    constructor(){
        this.hashList = new HashList("Sessions");
    }

    async checkSession(sessionId){
        let userId = await this.hashList.getHash('',sessionId);

        if (userId === null)
            return null;

        let realUserSession = userId.substring(0,userId.indexOf("__"));

        return realUserSession;
    }

    async createSession(UserAuthenticated){

        let userId = this.getUserId(UserAuthenticated);

        if (userId === '') return false;

        let sessionId = hat()+hat()+hat();

        await this.hashList.setHash('',sessionId,userId+'__'+new Date().toISOString());

        await SessionsHashList.addSession(UserAuthenticated, sessionId);

        return sessionId;
    }

    async deleteSession(sessionId, UserAuthenticated){
        let userId = this.getUserId(UserAuthenticated);

        if (userId === '') return false;

        let realUserSession = await this.hashList.checkSession('', sessionId);

        if (realUserSession !== userId){

            return false;

        }

        await this.hashList.deleteHash('',sessionId);

        return SessionsHashList.deleteSession(sessionId, UserAuthenticated);
    }

    async clearAllSessions(UserAuthenticated){

        return SessionsHashList.clearAllSessions(UserAuthenticated);;
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

        return userId;
    }

    async test(){

        let user1 = await this.createSession("user1");
        await this.createSession("user2");
        let user3 = await this.createSession("user3");
        await this.createSession("user1");
        await this.createSession("user2");
        await this.createSession("user2");

        await this.createSession("user5");
        let user4 = await this.createSession("user4");

        console.log(await this.deleteSession(user1,"user1"));
        console.log(await this.deleteSession(user3,"user3"));
        console.log(await this.deleteSession(user4,"user444"));

        await this.clearAllSessions("user2");
        await this.clearAllSessions("user4444");
        await this.clearAllSessions("user5");

        await this.clearAllSessions("user1");

    }

};

module.exports = new SessionHash();