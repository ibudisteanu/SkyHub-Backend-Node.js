/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/14/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopObjectsList = require('../../../../DB/Redis/lists/sorted-lists/TopObjectsList.helper.js');
var MaterializedParents = require ('../../../../DB/common/materialized-parents/MaterializedParents.helper.js');

class TopForums {

    //sortedList
    constructor(){
        this.topObjectsList = new TopObjectsList("Forums");
    }

    async getTopForums(userAuthenticated, parent, pageIndex, pageCount){

        return this.topObjectsList.getTopObjects(userAuthenticated, parent, pageIndex, pageCount);
    }

    async getForum(userAuthenticated, id){
        return MaterializedParents.getObject(userAuthenticated, id);
    }

    async keepSortedObject( key, score, parents, bDelete ){
        return this.topObjectsList.keepSortedObject(key, score, parents, bDelete);
    }

    async test(){

    }

};

module.exports = new TopForums();