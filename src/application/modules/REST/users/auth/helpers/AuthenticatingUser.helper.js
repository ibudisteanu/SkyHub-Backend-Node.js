/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/23/2017.
 * (C) BIT TECHNOLOGIES
 */
import constants from 'bin/constants';

var SessionHash = require ('../sessions/helpers/SessionHash.helper.js');
var UsersHelper = require('./Users.helper.js');
let HashListHelper = require('../sessions/helpers/SessionHash.helper.js');

class AuthenticatedUser {


    constructor(){
    }

    getSessionId(req){
        let sSessionId = '';
        if ((typeof req !== "undefined")&&(req.hasOwnProperty('sessionId'))) sSessionId = req.sessionId;
        if ((typeof req !== "undefined")&&(req.hasOwnProperty('body')))
            if (req.body.hasOwnProperty('sessionId'))
                sSessionId = req.body.sessionId||'';

        if ((sSessionId === "")||(sSessionId === null)||(sSessionId.length < 5)) {
            //console.log("Error. Invalid Session - session is empty");
            return null;
        }

        return sSessionId;
    }

    async loginUser(req){

        let sSessionId = this.getSessionId(req);

        if ((sSessionId === "")||(sSessionId === null)||(sSessionId.length < 5)) {
            //console.log("Error. Invalid Session - session is empty");
            return null;
        }

        console.log("@@@@@@@@@@@@ SESSION ID", sSessionId);

        //var userAuthenticatedData = jwt.verify(sToken, constants.SESSION_SECRET_KEY);
        //userId = userAuthenticatedData.id


        let userAuthenticatedId = await HashListHelper.checkSession(sSessionId);

        if ((userAuthenticatedId === null)||(userAuthenticatedId==='')) {
            console.log("Error. Invalid Session Id");
            return null;
        }

        let userAuthenticated = await UsersHelper.findUserById(userAuthenticatedId);

        if (userAuthenticated !== null) {
            UsersHelper.updateLastActivity(userAuthenticated);

            // console.log('updating last activity');
            // console.log('');console.log('');console.log('');console.log('');console.log('');console.log('');
            // console.log(userAuthenticated);
            // console.log(userAuthenticated.getPublicInformation(userAuthenticated));
            // console.log('finished updating last activity');

            return userAuthenticated;
        } else{
            console.log("Session found, but invalid User");
            return null;
        }

    }

    // constructor(){
    //     this.user = null;
    //     this.bLoggedIn=false;
    // }
    // loginUserFromSocket(socket){
    //
    //     this.user = socket.userAuthenticated;
    //
    //     if (this.user !== null)  this.bLoggedIn = true;
    //     else this.bLoggedIn = false;
    //
    //     return this;
    // }
    //
    // loginUserFromCookies(req, res){
    //     return this;
    // }
    //
    // getUserId(){
    //     if (this.bLoggedIn)
    //         return this.user.id;
    //     else
    //         return '';
    // }

}

module.exports = new AuthenticatedUser();