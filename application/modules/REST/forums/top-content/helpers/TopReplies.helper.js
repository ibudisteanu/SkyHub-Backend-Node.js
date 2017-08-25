/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/30/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopObjectsList = require('../../../../DB/Redis/lists/sorted-lists/TopObjectsList.helper.js');
var MaterializedParents = require ('../../../../DB/common/materialized-parents/MaterializedParents.helper.js');

class TopReplies {

    //sortedList
    constructor(){
        this.topObjectsList = new TopObjectsList("Replies");
    }

    getTopReplies(userAuthenticated, parent, pageIndex, pageCount){
        return this.topObjectsList.getTopObjects(userAuthenticated, parent, pageIndex, pageCount);
    }

    getAllReplies(userAuthenticated, parent){
        return this.topObjectsList.getTopObjects(userAuthenticated, parent, 0, 10000, 10000);
    }

    getReply(userAuthenticated, id){
        return MaterializedParents.getObject(userAuthenticated, id);
    }

    keepSortedObject( key, score, parents, bDelete ){
        return this.topObjectsList.keepSortedObject(key, score, parents, bDelete, false);
    }

    async test(){

    }

};

module.exports = new TopReplies();