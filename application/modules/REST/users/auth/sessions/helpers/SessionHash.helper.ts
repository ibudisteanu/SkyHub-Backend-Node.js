/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */

var HashList = require ('../../../../../DB/Redis/lists/HashList.helper.js');
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

    async createSession(userAuthenticated){

        let userId = this.getUserId(userAuthenticated);

        if (userId === '') return false;

        let sessionId = hat()+hat();

        await this.hashList.setHash('',sessionId,userId+'__'+new Date().getTime());

        await SessionsHashList.addSession(userAuthenticated, sessionId);

        return sessionId;
    }

    async deleteSession(sessionId, userAuthenticated){
        let userId = this.getUserId(userAuthenticated);

        if (userId === '') return false;

        let realUserSession = await this.hashList.checkSession('', sessionId);

        if (realUserSession !== userId){

            return false;

        }

        await this.hashList.deleteHash('',sessionId);

        return SessionsHashList.deleteSession(sessionId, userAuthenticated);
    }

    async clearAllSessions(userAuthenticated){

        return SessionsHashList.clearAllSessions(userAuthenticated);;
    }

    getUserId(userAuthenticated){
        let userId = '';
        if (typeof userAuthenticated === "string") userId = userAuthenticated;
        else
        if (typeof userAuthenticated === "object"){

            if (userAuthenticated.hasOwnProperty('id'))
                userId = userAuthenticated.id;
            else
            if ((userAuthenticated.hasOwnProperty('user'))&&(userAuthenticated.user.hasOwnProperty('id')))
                userId = userAuthenticated.user.id;
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