/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */

import HashList from 'DB/Redis/lists/HashList.helper'
import SessionHashHelper from 'REST/users/auth/sessions/helpers/SessionHash.helper'

var hat = require('hat');

class SessionsHashList {

    constructor(){
        this.hashList = new HashList("SessionsLists");
    }

    async getSessions(userAuthenticated){
        let userId = this.getUserId(userAuthenticated);

        if (userId === '') return [];

        let SessionsList = await this.hashList.getHash('',userId);

        if (SessionsList === null) SessionsList = [];
        else return JSON.parse(SessionsList);

        return SessionsList;
    }

    async addSession(userAuthenticated, sessionId) {

        let userId = this.getUserId(userAuthenticated);

        if (userId === '') return [];


        let CurrentSessionsList = await this.getSessions(userAuthenticated);


        let index = CurrentSessionsList.indexOf(sessionId);
        if (index > -1)
            return false;

        CurrentSessionsList.push(sessionId);

        return this.hashList.setHash('',userId,CurrentSessionsList);
    }


    async deleteSession(sessionId, userAuthenticated){
        let userId = this.getUserId(userAuthenticated);

        if (userId === '') return false;

        let CurrentSessionsList = await this.getSessions(userId);

        //console.log("\n\n CurrentSessionsList ", CurrentSessionsList);

        let index = CurrentSessionsList.indexOf(sessionId);
        if (index > -1)
            CurrentSessionsList.splice(index, 1);

        await this.hashList.setHash('',userId,CurrentSessionsList);
    }


    async clearAllSessions(userAuthenticated){
        let userId = this.getUserId(userAuthenticated);

        if (userId === '') return false;

        let CurrentSessionsList = await this.getSessions(userId);

        for (let i=CurrentSessionsList.length-1; i>=0; i--)
        {
            SessionHashHelper.deleteSession(CurrentSessionsList[i], userAuthenticated);
        }

        return this.hashList.deleteHash('',userId);
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

}

export default new SessionsHashList();