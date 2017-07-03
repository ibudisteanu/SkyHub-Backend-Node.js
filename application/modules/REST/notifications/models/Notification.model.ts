/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/2/2017.
 * (C) BIT TECHNOLOGIES
 */

class Notification {

    // id = '';
    // dtCreation = 0;
    // authorId = '';
    // template = '';
    // params: {}; //params is a JSON object that contains objects

    constructor( data) {

        if (typeof data === "undefined") data = {};

        this.id = data.id||'';
        this.dtCreation = data.dtCreation || '';
        this.authorId = data.authorId || '';
        this.template = data.template || '';

        this.params = data.params || {};
    }

    toJSON_REDIS(){

        return {
            id: this.id,
            dtCreation: this.dtCreation.getTime(),
            authorId: this.authorId,
            template: this.template,
            params: this.params,
        }

    }

}

module.exports = Notification;
