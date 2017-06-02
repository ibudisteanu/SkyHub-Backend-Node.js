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
     This method loads forum/topic/reply from the Id

     sObjectId contains inside also the type of the object example: 1_frm_14958198943447852

     */
    async findObjectFromId(sObjectId){

        var iDelimitatorPosLeft = sObjectId.indexOf("_");
        var iDelimitatorPosRight = sObjectId.indexOf("_",iDelimitatorPosLeft+1);

        var iRedisDB = sObjectId.substring(0,iDelimitatorPosLeft);
        var sObjectType = sObjectId.substring(iDelimitatorPosLeft+1,iDelimitatorPosRight);

        console.log("finding OBJECT ID: ", iRedisDB, " :::: ", sObjectType, " :::: ", sObjectId);

        switch (sObjectType) {
            case 'us':
                //var UserModel = redis.nohm.factory('UserModel');

                var UsersHelper = require('../../../REST/auth/helpers/Users.heper.ts');

                return UsersHelper.findUserById(sObjectId);

            case 'frm':

                //var ForumModel = redis.nohm.factory('ForumModel');

                var ForumsHelper = require ('../../../REST/forums/forums/helpers/Forums.helper.ts');

                return ForumsHelper.findForumById(sObjectId);
        }

        return null;

    }


    /*
        Get Unique Materialized Parents from String
     */

    getMaterializedParentsFromStringList(parentsList, arrParentsOutput){
        if (typeof parentsList === "string") parentsList = [parentsList];

        if (typeof arrParentsOutput === "undefined") arrParentsOutput = [];

        for (var i=0; i<parentsList.length; i++){

            var arrParentsBuffer = parentsList[i].split(",")

            for (var j=0; j<arrParentsBuffer.length; j++)//check for duplicity
                if (arrParentsOutput.indexOf(arrParentsBuffer[j]) < 0 )
                {
                    arrParentsOutput.push(arrParentsBuffer[j]);
                }
        }
        return arrParentsOutput;
    }



    /*
        first solution is go to the parent and merge all his materialized parents
     */

    async findAllMaterializedParentsByMergingItsMaterializedGrandParents(parentsIds, arrParentsOutput, iNestedLevel) {

        if (typeof arrParentsOutput === "undefined") arrParentsOutput = [];
        if (typeof parentsIds === "string") parentsIds = [parentsIds];
        if (typeof iNestedLevel === "undefined")  iNestedLevel = 1000;

        for ( var i=0; i < parentsIds.length; i++)
            arrParentsOutput = this.getMaterializedParentsFromStringList(parentsIds[i], arrParentsOutput);


        for (var j=0; j<arrParentsOutput.length; j++){

            var sMaterializedParent = arrParentsOutput[j];
            var objectParent = await this.findObjectFromId(sMaterializedParent);

            if (objectParent !== null){

                if ( iNestedLevel > 0)
                    arrParentsOutput = this.findAllMaterializedParentsByMergingItsMaterializedGrandParents(objectParent.parentId+','+objectParent.parents, arrParentsOutput, iNestedLevel-1);
            }

        }

        return arrParentsOutput;

    }

    async findAllMaterializedParents (Object){
        return this.findAllMaterializedParentsByMergingItsMaterializedGrandParents(Object.parentId+','+Object.parents);
    }

    async test(){

        console.log("Finding object by Id ",await this.findObjectFromId("1_frm_14958198943447852") );
        console.log("Finding object by Id ",await this.findObjectFromId("1_us_14958408645963304") );

        var object = await this.findObjectFromId("1_frm_14958198943447852");
        console.log("find all MATERIALIZED PARENTS ",await this.findAllMaterializedParents(object) );
    }

};

module.exports = new MaterializedParents;