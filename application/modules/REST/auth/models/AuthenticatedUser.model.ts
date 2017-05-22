/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/23/2017.
 * (C) BIT TECHNOLOGIES
 */

export class AuthenticatedUser {

    public user = {};
    public bLoggedIn = false;

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