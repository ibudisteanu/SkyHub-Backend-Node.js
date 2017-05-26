/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/23/2017.
 * (C) BIT TECHNOLOGIES
 */

class AuthenticatedUser {


    constructor(){
        this.user = null;
        this.bLoggedIn = false;
    }

    loginUserFromSocket(socket){

        this.user = socket.userAuthenticated;

        if (this.user !== null)  this.bLoggedIn = true;
        else this.bLoggedIn = false;

        return this;

    }

    loginUserFromCookies(req, res){
        return this;
    }

    getUserId(){
        if (this.bLoggedIn)
            return this.user.id;
        else
            return '';
    }

}

module.exports = new AuthenticatedUser();