/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/2/2017.
 * (C) BIT TECHNOLOGIES
 */

export default class Notification {

    // id = '';
    // dtCreation = 0;
    // authorId = '';
    // params: {}; //params is a JSON object that contains objects

    constructor( data) {

        if (typeof data === "undefined") data = {};

        this.id = data.id||'';
        this.dtCreation = data.dtCreation || '';
        this.authorId = data.authorId || '';
        this.template = data.template || '';
        this.params = data.params || {};
    }

    getJSON(){

        return {
            id: this.id,
            dtCreation: this.dtCreation,
            authorId: this.authorId,
            params: this.params,
        }

    }



}
