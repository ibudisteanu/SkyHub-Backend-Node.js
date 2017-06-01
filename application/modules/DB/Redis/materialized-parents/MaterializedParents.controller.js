/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/1/2017.
 * (C) BIT TECHNOLOGIES
 */
/**
 * Created by BIT TECHNOLOGIES on 6/1/2017.
 *
 * TUTORIAL based on https://stackoverflow.com/questions/30725358/node-js-redis-zadd-objects-to-a-set
 *
 */

//var redis = require ('./../m../modules/DB/redis_nohm.js');
var redis = require ('../../../DB/redis_nohm.js');

var MaterializedParents = class{

    constructor (tablePrefix){

    }

    /*
        Get Unique Materialized Parents from String
     */

    getMaterializedParentsFromString(parentsList, arrParentsOutput){
        if (typeof parentsList === "string") parentsList = [parentsList];

        if (typeof arrParentsOutput === "undefined") arrParentsOutput = [];

        for (var i=0; i<parentsList.length; i++){

            arrParentsBuffer = parentsList[i].splot(",")
            for (var j=0; j<arrParentsBuffer.length; j++)
                if (arrParentsOutput.indexOf(arrParentsBuffer[j]) < 0 )
                {
                    arrParentsOutput.push(arrParentsBuffer[j]);
                }
        }
        return arrParentsOutput;
    },

    /*
        This method loads forum/topic/reply from the Id
     */
    async findObjectFromId(sId){

    }

    /*
        first solution is go to the parent and merge all his materialized parents
     */

    async findAllMaterializedParentsByMergingItsMaterializedGrandParents(parentsIds, arrParentsOutput){

        if (typeof arrParentsOutput === "undefined") arrParentsOutput = [];
        if (typeof parentsIds === "string") parentsIds = [parentsIds];



        var arrParentsOutput = this.getMaterializedParentsFromString(sParentsId);

        for (var i=0; i<arrParentsList.length; i++){

            var sMaterializedParent = arrParentsList[i];
            var objectParent = await this.findObjectFromId(sMaterializedParent);

            if (objectParent !== null){

            }


        }
    }

    async findAllMaterializedParents(sParentsId){

        return this.findAllMaterializedParentsByMergingItsMaterializedGrandParents(sParentsId);

    }

};

module.exports = SortedList;