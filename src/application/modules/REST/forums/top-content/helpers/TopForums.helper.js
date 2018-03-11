/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/14/2017.
 * (C) BIT TECHNOLOGIES
 */

import TopObjectsListHelper from 'DB/Redis/lists/sorted-lists/TopObjectsList.helper'
import MaterializedParentsHelper from 'DB/common/materialized-parents/MaterializedParents.helper';

class TopForums {

    //sortedList
    constructor(){
        this.topObjectsList = new TopObjectsListHelper("Forums");
    }

    async getTopForums(userAuthenticated, parent, pageIndex, pageCount){

        return this.topObjectsList.getTopObjects(userAuthenticated, parent, pageIndex, pageCount);
    }

    async getForum(userAuthenticated, id){
        return MaterializedParentsHelper.getObject(userAuthenticated, id);
    }

    async keepSortedObject( key, score, parents, bDelete ){
        return this.topObjectsList.keepSortedObject(key, score, parents, bDelete);
    }

    async test(){

    }

};

export default new TopForums();