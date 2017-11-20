/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/1/2017.
 * (C) BIT TECHNOLOGIES
 */


import * as redis from 'DB/redis_nohm'

var URLHashHelper = require ('REST/common/URLs/helpers/URLHash.hashlist.js');

var MaterializedParents = class{

    constructor (tablePrefix){

    }


    /*
     Loading forum/topic/reply from the Id

     sObjectId contains inside also the type of the object example: 1_frm_14958198943447852

     */

    extractDataFromIds(objectId) {

        if (typeof objectId === "object") objectId = objectId.id;
        if (typeof objectId !== "string") return null;

        //console.log("extract data from Ids",objectId);

        var iDelimitatorPosLeft = objectId.indexOf("_");
        var iDelimitatorPosRight = objectId.indexOf("_", iDelimitatorPosLeft + 1);

        var iRedisDB = objectId.substring(0, iDelimitatorPosLeft);
        var sObjectType = objectId.substring(iDelimitatorPosLeft + 1, iDelimitatorPosRight);

        //console.log("finding OBJECT ID: ", iRedisDB, " :::: ", sObjectType, " :::: ", sObjectId);

        if ((iRedisDB !== 0) && (sObjectType !== ''))
            return {redisDB: iRedisDB, objectType: sObjectType};
        else
            return null
    }

    extractObjectTypeFromId(object) {

        let extractedIdData = this.extractDataFromIds(object);

        if (extractedIdData === null) return 'none';

        switch (extractedIdData.objectType || '') {
            case 'forum':
                return 'forum';

            case 'reply':
                return 'reply';

            case 'user':
                return 'user';

            case 'topic':
                return 'topic';

        }

        return 'none'
    }

    async findIdFromURL(sObjectURL){

        if (( sObjectURL === null)||(typeof sObjectURL === "undefined")) return null;
        if ( sObjectURL.constructor === "Object") return sObjectURL;

        if ((sObjectURL.length > 1)&&(sObjectURL[1] === '/' )) sObjectURL = sObjectURL.substr(1); //removing the /prefix
        console.log("FIND ID FROM URL    ",sObjectURL);

        sObjectURL = sObjectURL.toLowerCase();// I am storing low-case URLs

        return await URLHashHelper.getId(sObjectURL);

    }

    async findObjectFromId(sObjectId){

        let idData = this.extractDataFromIds(sObjectId);

        if (idData === null) return null;

        switch (idData.objectType) {
            case 'user':
                //var UserModel = redis.nohm.factory('UserModel');
                let UsersHelper = require('REST/users/auth/helpers/Users.helper.js');

                return await UsersHelper.findUserById(sObjectId);

            case 'forum':
                //var ForumModel = redis.nohm.factory('ForumModel');
                let ForumsHelper = require ('REST/forums/forums/helpers/Forums.helper.js');

                return await ForumsHelper.findForumById(sObjectId);

            case 'reply':
                let RepliesHelper = require('REST/forums/replies/helpers/Replies.helper.js');

                return await RepliesHelper.findReplyById(sObjectId);

            case 'topic':
                //var ForumModel = redis.nohm.factory('ForumModel');
                let TopicsHelper = require ('REST/forums/topics/helpers/Topics.helper.js');

                //console.log('    topic found: ',sObjectId, await TopicsHelper.findTopicById(sObjectId));

                return await TopicsHelper.findTopicById(sObjectId);
        }

        return null;
    }

    /*
        Loading objects from URL
     */
    async findObjectFromURL(sObjectURL){

        if (( sObjectURL === null)||(typeof sObjectURL === "undefined")) return null;
        if ( typeof sObjectURL === "object") return sObjectURL; //an object already
        if (sObjectURL === '') return null;

        let sIdExtracted = await this.findIdFromURL(sObjectURL);

        console.log('     @@@findObjectFromURL', '#'+sObjectURL+'#', sIdExtracted);

        if (sIdExtracted !== null)
            return await this.findObjectFromId(sIdExtracted);

        return null;
    }

    async findObject(objectToSearch){

        if (objectToSearch === null) return null;
        if ((typeof objectToSearch !== "undefined") && (typeof objectToSearch !== "string") && (typeof objectToSearch === "object")) return objectToSearch; //already and object

        let idData = this.extractDataFromIds(objectToSearch);

        if (idData !== null) return await this.findObjectFromId(objectToSearch);
        else return await this.findObjectFromURL(objectToSearch);

        return null;
    }

    async getObject(userAuthenticated, id){

        let object = await this.findObject(id);

        if (object !== null){
            return({
                result: true,
                content: object.getPublicInformation(userAuthenticated),
            })
        }

        return({
            result: false,
            content: [],
        })

    }

    /*
        Get Unique Materialized Parents from String
     */

    getMaterializedParentsFromStringList(parentsList, arrParentsOutput){
        if (typeof parentsList === "string") parentsList = [parentsList];

        if ((typeof arrParentsOutput === "undefined")||(arrParentsOutput === null)) arrParentsOutput = [];

        for (let i=0; i<parentsList.length; i++){

            let arrParentsBuffer = parentsList[i].split(",");

            for (let j=0; j<arrParentsBuffer.length; j++)//check for duplicity
                if ((arrParentsBuffer[j]!=="")&&(typeof arrParentsBuffer[j] !== "undefined")&&(arrParentsOutput.indexOf(arrParentsBuffer[j]) < 0 ))
                {
                    arrParentsOutput.push(arrParentsBuffer[j]);
                }
        }
        return arrParentsOutput;
    }

    async getObjectId(objectToSearch){

        if ((objectToSearch === null)||(typeof objectToSearch === "undefined")) return '';
        if (objectToSearch === '') return '';
        if (typeof objectToSearch === "object" ) return objectToSearch.id;//in case their is a Model Object, we will return its ID

        //in case the argument is actually and ID
        if (this.extractDataFromIds(objectToSearch) !== null)
            return objectToSearch; //  valid id... it means it is the ID
        else {
            let object = await this.findObjectFromURL(objectToSearch);

            if (object !== null)
                return object.id;
        }

        return '';
    }

    async createBreadcrumbs(parent){
        let currentBreadcrumbs = [];
        parent = await this.findObject(parent);
        if (parent !== null){
            currentBreadcrumbs = parent.p('breadcrumbs')||[];

            //console.log(currentBreadcrumbs, typeof currentBreadcrumbs);
            if (typeof currentBreadcrumbs === "string") currentBreadcrumbs = JSON.parse(currentBreadcrumbs);

            let newBreadcrumb = {
                url: parent.p('URL'),
                name: parent.p('title')||parent.p('name'),
                type: this.extractObjectTypeFromId(parent.id),
            };

            currentBreadcrumbs.push(newBreadcrumb);
        }

        return currentBreadcrumbs;
    }


    /*
        first solution is go to the parent and merge all his materialized parents
     */

    async findAllMaterializedParentsByMergingItsMaterializedGrandParents(parentsIds, arrParentsOutput, iNestedLevel, arrCheckedAlready) {

        if (typeof arrParentsOutput === "undefined") arrParentsOutput = [];
        if (typeof parentsIds === "string") parentsIds = [parentsIds];
        if (typeof iNestedLevel === "undefined")  iNestedLevel = 100;
        if (typeof arrCheckedAlready === "undefined") arrCheckedAlready = [];

        for ( let i=0; i < parentsIds.length; i++)
            arrParentsOutput = this.getMaterializedParentsFromStringList(parentsIds[i], arrParentsOutput);

        //console.log("parents",parentsIds, arrParentsOutput);

        let todosParents = [];
        for (let j=0; j<arrParentsOutput.length; j++){

            let sMaterializedParent = arrParentsOutput[j];

            let bCheckedAlready=false;
            for (let q=0; q < arrCheckedAlready.length; q++)
                if (arrCheckedAlready[q] == sMaterializedParent) {
                    bCheckedAlready=true;
                    break;
                }

            if (!bCheckedAlready){
                arrCheckedAlready.push(sMaterializedParent);
                todosParents.push(sMaterializedParent);
            }
        }

        for (let j=0; j<todosParents.length; j++) {

            let sMaterializedParent = todosParents[j];

            let objectParent = await this.findObjectFromId(sMaterializedParent);

            if (objectParent !== null){

                if ( iNestedLevel > 0)
                    arrParentsOutput = await this.findAllMaterializedParentsByMergingItsMaterializedGrandParents(objectParent.p('parentId')+','+objectParent.p('parents'), arrParentsOutput, iNestedLevel-1, arrCheckedAlready);
            }

        }

        return arrParentsOutput;
    }

    async findAllMaterializedParents (Object){

        let sParentId = '';
        if (typeof Object === "string") sParentId = Object;
        else if ((typeof Object === 'object')&&(Object !== null)) sParentId = Object.p('parentId')+','+Object.p('parents');

        console.log("parents",sParentId);

        return await this.findAllMaterializedParentsByMergingItsMaterializedGrandParents(sParentId);
    }

    async test(){

        console.log("Finding object by Id ",await this.findObjectFromId("1_frm_14958198943447852") );
        console.log("Finding object by Id ",await this.findObjectFromId("1_us_14958408645963304") );

        var object = await this.findObjectFromId("1_frm_14974606406414877");
        console.log("find object - ", (object !== null ? object.id : 'not found'));
        console.log("find all MATERIALIZED PARENTS ",await this.findAllMaterializedParents(object) );

        let newBreadCrumbs = await this.createBreadcrumbs("1_forum_14979701092538550");
        console.log("new bread crumbs",newBreadCrumbs, typeof newBreadCrumbs);
    }

};

module.exports = new MaterializedParents;