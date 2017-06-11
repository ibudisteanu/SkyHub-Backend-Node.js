/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */

var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');

var hat = require('hat');

class SessionsHashList {

    constructor(){
        this.hashList = new HashList("SessionsLists");
    }

    async getSessions(UserAuthenticated){
        let userId = this.getUserId(UserAuthenticated);

        if (userId === '') return [];

        let SessionsList = await this.hashList.getHash('',userId);

        if (SessionsList === null) SessionsList = [];
        else return JSON.parse(SessionsList);

        return SessionsList;
    }

    async addSession(UserAuthenticated, sessionId) {

        let userId = this.getUserId(UserAuthenticated);

        if (userId === '') return [];


        let CurrentSessionsList = await this.getSessions(UserAuthenticated);


        let index = CurrentSessionsList.indexOf(sessionId);
        if (index > -1)
            return false;

        CurrentSessionsList.push(sessionId);

        return this.hashList.setHash('',userId,CurrentSessionsList);
    }


    async deleteSession(sessionId, UserAuthenticated){
        let userId = this.getUserId(UserAuthenticated);

        if (userId === '') return false;

        let CurrentSessionsList = await this.getSessions(userId);

        //console.log("\n\n CurrentSessionsList ", CurrentSessionsList);

        let index = CurrentSessionsList.indexOf(sessionId);
        if (index > -1)
            CurrentSessionsList.splice(index, 1);

        await this.hashList.setHash('',userId,CurrentSessionsList);
    }


    async clearAllSessions(UserAuthenticated){
        let userId = this.getUserId(UserAuthenticated);

        if (userId === '') return false;

        let SessionHash = require ('./SessionHash.helper.ts');

        let CurrentSessionsList = await this.getSessions(userId);

        for (let i=CurrentSessionsList.length-1; i>=0; i--)
        {
            SessionHash.deleteSession(CurrentSessionsList[i], UserAuthenticated);
        }

        return this.hashList.deleteHash('',userId);
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

};

module.exports = new SessionsHashList();