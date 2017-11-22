/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/30/2017.
 * (C) BIT TECHNOLOGIES
 */

import TopObjectsListHelper from 'DB/Redis/lists/sorted-lists/TopObjectsList.helper'
import MaterializedParentsHelper from 'DB/common/materialized-parents/MaterializedParents.helper';

class TopReplies {

    //sortedList
    constructor(){
        this.topObjectsList = new TopObjectsListHelper("Replies");
    }

    getTopReplies(userAuthenticated, parent, pageIndex, pageCount){
        return this.topObjectsList.getTopObjects(userAuthenticated, parent, pageIndex, pageCount);
    }

    getAllReplies(userAuthenticated, parent){
        return this.topObjectsList.getTopObjects(userAuthenticated, parent, 0, 10000, 10000);
    }

    getReply(userAuthenticated, id){
        return MaterializedParentsHelper.getObject(userAuthenticated, id);
    }

    keepSortedObject( key, score, parents, bDelete ){
        return this.topObjectsList.keepSortedObject(key, score, parents, bDelete, false);
    }

    async test(){

    }

};

module.exports = new TopReplies();