/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/1/2017.
 * (C) BIT TECHNOLOGIES
 */


//var redis = require ('./../m../modules/DB/redis_nohm.js');
var redis = require ('../../redis_nohm.js');

var MaterializedParents = class{

    constructor (tablePrefix){

    }


    /*
     Loading forum/topic/reply from the Id

     sObjectId contains inside also the type of the object example: 1_frm_14958198943447852

     */

    extractDataFromIds(sObjectId){

        if (typeof sObjectId !== "string") return null;

        var iDelimitatorPosLeft = sObjectId.indexOf("_");
        var iDelimitatorPosRight = sObjectId.indexOf("_",iDelimitatorPosLeft+1);

        var iRedisDB = sObjectId.substring(0,iDelimitatorPosLeft);
        var sObjectType = sObjectId.substring(iDelimitatorPosLeft+1,iDelimitatorPosRight);

        console.log("finding OBJECT ID: ", iRedisDB, " :::: ", sObjectType, " :::: ", sObjectId);

        if ((iRedisDB !== 0) && (sObjectType !== ''))
            return {redisDB : iRedisDB, objectType : sObjectType};
        else
            return null

    }

    async findObjectFromId(sObjectId){

        var idData = this.extractDataFromIds(sObjectId);

        if (idData === null) return null;

        switch (idData.objectType) {
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
        Loading objects from URL
     */
    async findObjectFromURL(sObjectURL){

        if (typeof sObjectURL !== "string") return null;

    }

    async findObject(objectToSearch){

        var idData = this.extractDataFromIds(objectToSearch);

        if (idData !== null) return this.findObjectFromId(objectToSearch);
        else return this.findObjectFromURL(objectToSearch);

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

    getObjectId(objectToSearch){

        var idData = this.extractDataFromIds(objectToSearch);

        var id = '';

        if (idData !== null) id = objectToSearch; // valid id... it means it is the ID
        else {
            var object = this.findObjectFromURL(objectToSearch);
            if (object !== null) id = object.id;
        }

        return id;
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

        var sParentId = '';
        if (typeof Object === "string") sParentId = Object;
        else sParentId = Object.parentId+','+Object.parents;

        return this.findAllMaterializedParentsByMergingItsMaterializedGrandParents(sParentId);
    }

    async test(){

        console.log("Finding object by Id ",await this.findObjectFromId("1_frm_14958198943447852") );
        console.log("Finding object by Id ",await this.findObjectFromId("1_us_14958408645963304") );

        var object = await this.findObjectFromId("1_frm_14958198943447852");
        console.log("find all MATERIALIZED PARENTS ",await this.findAllMaterializedParents(object) );
    }

};

module.exports = new MaterializedParents;