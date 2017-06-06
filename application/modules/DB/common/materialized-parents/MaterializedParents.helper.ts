/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/1/2017.
 * (C) BIT TECHNOLOGIES
 */


//var redis = require ('./../m../modules/DB/redis_nohm.js');
var redis = require ('../../redis_nohm.js');
var URLHashHelper = require ('../../../../modules/REST/common/URLs/helpers/URLHash.helper.ts');

var MaterializedParents = class{

    constructor (tablePrefix){

    }


    /*
     Loading forum/topic/reply from the Id

     sObjectId contains inside also the type of the object example: 1_frm_14958198943447852

     */

    extractDataFromIds(sObjectId){

        if (typeof sObjectId !== "string") return null;

        let iDelimitatorPosLeft = sObjectId.indexOf("_");
        let iDelimitatorPosRight = sObjectId.indexOf("_",iDelimitatorPosLeft+1);

        let iRedisDB = sObjectId.substring(0,iDelimitatorPosLeft);
        let sObjectType = sObjectId.substring(iDelimitatorPosLeft+1,iDelimitatorPosRight);

        //console.log("finding OBJECT ID: ", iRedisDB, " :::: ", sObjectType, " :::: ", sObjectId);

        if ((iRedisDB !== 0) && (sObjectType !== ''))
            return {redisDB : iRedisDB, objectType : sObjectType};
        else
            return null
    }

    async findIdFromURL(sObjectURL){

        if ( sObjectURL === null) return null;
        if ( sObjectURL.constructor === "Object") return sObjectURL;

        return await URLHashHelper.getId(sObjectURL);

    }

    async findObjectFromId(sObjectId){

        let idData = this.extractDataFromIds(sObjectId);

        if (idData === null) return null;

        switch (idData.objectType) {
            case 'us':
                //var UserModel = redis.nohm.factory('UserModel');

                let UsersHelper = require('../../../REST/auth/helpers/Users.heper.ts');

                return await UsersHelper.findUserById(sObjectId);

            case 'frm':

                //var ForumModel = redis.nohm.factory('ForumModel');

                let ForumsHelper = require ('../../../REST/forums/forums/helpers/Forums.helper.ts');

                return await ForumsHelper.findForumById(sObjectId);
        }

        return null;
    }

    /*
        Loading objects from URL
     */
    async findObjectFromURL(sObjectURL){

        if ( sObjectURL === null) return null;
        if ( sObjectURL.constructor === "Object") return sObjectURL;

        let sId = await this.findIdFromURL(sObjectURL);

        if (sId !== null)
            return await this.findObjectFromId(sId);

        return null;
    }

    async findObject(objectToSearch){


        let idData = this.extractDataFromIds(objectToSearch);

        if (idData !== null) return await this.findObjectFromId(objectToSearch);
        else return await this.findObjectFromURL(objectToSearch);

        return null;
    }


    /*
        Get Unique Materialized Parents from String
     */

    getMaterializedParentsFromStringList(parentsList, arrParentsOutput){
        if (typeof parentsList === "string") parentsList = [parentsList];

        if (typeof arrParentsOutput === "undefined") arrParentsOutput = [];

        for (let i=0; i<parentsList.length; i++){

            let arrParentsBuffer = parentsList[i].split(",");

            for (let j=0; j<arrParentsBuffer.length; j++)//check for duplicity
                if (arrParentsOutput.indexOf(arrParentsBuffer[j]) < 0 )
                {
                    arrParentsOutput.push(arrParentsBuffer[j]);
                }
        }
        return arrParentsOutput;
    }

    getObjectId(objectToSearch){

        if (objectToSearch === null) return '';
        if (objectToSearch === '') return '';
        if (objectToSearch.constructor === "object" ) return objectToSearch.id;//in case their is a Model Object, we will return its ID

        //in case the argument is actually and ID
        if (this.extractDataFromIds(objectToSearch) !== null)
            return objectToSearch; //  valid id... it means it is the ID
        else {
            let object = this.findObjectFromURL(objectToSearch);

            if (object !== null)
                return object.id;
        }

        return '';
    }


    /*
        first solution is go to the parent and merge all his materialized parents
     */

    async findAllMaterializedParentsByMergingItsMaterializedGrandParents(parentsIds, arrParentsOutput, iNestedLevel) {

        if (typeof arrParentsOutput === "undefined") arrParentsOutput = [];
        if (typeof parentsIds === "string") parentsIds = [parentsIds];
        if (typeof iNestedLevel === "undefined")  iNestedLevel = 1000;

        for ( let i=0; i < parentsIds.length; i++)
            arrParentsOutput = this.getMaterializedParentsFromStringList(parentsIds[i], arrParentsOutput);


        for (let j=0; j<arrParentsOutput.length; j++){

            let sMaterializedParent = arrParentsOutput[j];
            let objectParent = await this.findObjectFromId(sMaterializedParent);

            if (objectParent !== null){

                if ( iNestedLevel > 0)
                    arrParentsOutput = this.findAllMaterializedParentsByMergingItsMaterializedGrandParents(objectParent.parentId+','+objectParent.parents, arrParentsOutput, iNestedLevel-1);
            }

        }

        return arrParentsOutput;
    }

    async findAllMaterializedParents (Object){

        let sParentId = '';
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