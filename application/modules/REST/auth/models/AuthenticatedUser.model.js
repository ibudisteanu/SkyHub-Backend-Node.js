/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/23/2017.
 * (C) BIT TECHNOLOGIES
 */

class AuthenticatedUser {


    constructor(){
        this.user = {};
        this.bLoggedIn = false;
    }

    loginUserFromSocket(socket){

        this.user = socket.userAuthenticated;

        if (this.user != {})
            this.bLoggedIn = true;
        else
            this.bLoggedIn = false;

        return this.user;

    }

    loginUserFromCookies(req, res){

    }

}

module.exports = new AuthenticatedUser();