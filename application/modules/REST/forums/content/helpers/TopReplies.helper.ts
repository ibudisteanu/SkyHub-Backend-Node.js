/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/30/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopObjectsList = require('../../../../DB/Redis/lists/sorted-lists/TopObjectsList.helper.ts');


class TopReplies {

    //sortedList
    constructor(){
        this.topObjectsList = new TopObjectsList("Replies");
    }

    async getTopReplies(userAuthenticated, parent, pageIndex, pageCount){
        return this.topObjectsList.getTopObjects(userAuthenticated, parent, pageIndex, pageCount);
    }

    async getAllReplies(userAuthenticated, parent){
        return this.topObjectsList.getTopObjects(userAuthenticated, parent, 0, 10000, 10000);
    }

    async getReply(userAuthenticated, id){
        return this.topObjectsList.getObject(userAuthenticated, id);
    }

    async keepSortedObject( key, score, parents, bDelete ){
        return this.topObjectsList.keepSortedObject(key, score, parents, bDelete, false);
    }

    async test(){

    }

};

module.exports = new TopReplies();