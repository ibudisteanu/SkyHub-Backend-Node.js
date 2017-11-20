/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/30/2017.
 * (C) BIT TECHNOLOGIES
 */

import * as redis from 'DB/redis_nohm'

let replyModel = require ('../models/Reply.model.js');
let commonFunctions = require ('../../../common/helpers/CommonFunctions.helper.js');
let URLHashHelper = require ('../../../common/URLs/helpers/URLHash.hashlist.js');
let MaterializedParentsHelper = require ('DB/common/materialized-parents/MaterializedParents.helper.js');
let SearchesHelper = require ('../../../searches/helpers/Searches.helper.js');
let hat = require ('hat');
let VotingsHashList = require ('../../../voting/helpers/Votings.hashlist.js');
let RepliesSorter = require('../models/RepliesSorter.js');
let SanitizeAdvanced = require('../../../common/helpers/SanitizeAdvanced.js');

let NotificationsCreator = require ('../../../notifications/NotificationsCreator.js');
let NotificationsSubscribersHashList = require ('./../../../notifications/subscribers/helpers/NotificationsSubscribers.hashlist.js');

module.exports = {

    createDummyForum (iIndex){

        iIndex = iIndex || 0;

        return this.addReply("reply_"+iIndex,"userDummy_"+iIndex, "123456","Gigel",
            "Nume"+iIndex,"RO","Bucharest", "RO", "http://www.gravatar.com/avatar/ee4d1b570eff6ce63"+iIndex+"?default=wavatar&forcedefault=1",
            "http://www.hdfbcover.com/randomcovers/covers/never-stop-dreaming-quote-fb-cover.jpg");
    },

    /*
     FINDING & LOADING REPLY from ID, URL
     */
    async findReply(sRequest){

        console.log("Finding reply :::  " + sRequest);

        let replyFound = await this.findForumById(sRequest);

        if (replyFound !== null) return replyFound;
        else return await this.findForumByURL(sRequest);
    },

    async findReplyById (sId){

        return new Promise( (resolve)=> {

            if ((typeof sId === 'undefined') || (sId === null) || (sId == []) )
                resolve(null);
            else
                var ReplyModel  = redis.nohm.factory('ReplyModel', sId, function (err, reply) {
                    if (err) resolve (null);
                    else resolve (ReplyModel);
                });

        });
    },

    findReplyByURL (sURL){

        sURL = sURL || "";
        return new Promise( (resolve)=> {
            if ((typeof sURL === 'undefined') || (sURL === null) || (sURL == []) )
                resolve(null);
            else
                return null;

            let ReplyModel = redis.nohm.factory('ReplyModel');
            ReplyModel.findAndLoad(  {URL: sURL }, function (err, replies) {
                if (replies.length) resolve(replies[0]);
                else resolve (null);
            });

        });
    },


    /*
     CREATING A NEW REPLY
     */
    async addReply (userAuthenticated, parent, parentReply, sTitle, sDescription, arrAttachments, arrKeywords, sCountry, sCity, sLanguage, dbLatitude, dbLongitude, dtCreation, arrAdditionalInfo){

        if ((typeof dtCreation === 'undefined') || (dtCreation === null)) dtCreation = '';
        if ((typeof arrAdditionalInfo === 'undefined')) arrAdditionalInfo = {};

        try{
            sCountry = sCountry || ''; sCity = sCity || ''; dbLatitude = dbLatitude || -666; dbLongitude = dbLongitude || -666; sTitle = sTitle || '';

            sLanguage = sLanguage || sCountry;
            parent = parent || '';

            let reply = redis.nohm.factory('ReplyModel');
            let errorValidation = {};


            //get object from parent
            //console.log("addReplies ===============", userAuthenticated);

            let parentObject = await MaterializedParentsHelper.findObject(parent);

            if (parentObject === null){
                return {
                    result:false,
                    message: 'Parent not found. Probably the topic you had been replying in, has been deleted in the mean while',
                }
            }

            // sDescription = striptags(sDescription, ['a','b','i','u','strong', 'h1','h2','h3','h4','h5','div','font','ul','li','img', 'br', 'span','p','div','em','iframe']);
            // let shortDescription = striptags(sDescription, ['a','b','i','u','strong','div','font','ul','li', 'br', 'span','p','div','em','iframe']);
            // if (shortDescription.length > 512) shortDescription = shortDescription.substr(0, 512);

            sDescription = SanitizeAdvanced.sanitizeAdvanced(sDescription);
            let shortDescription = SanitizeAdvanced.sanitizeAdvancedShortDescription(sDescription, 512);

            parentReply = await MaterializedParentsHelper.findObject(parentReply);

            console.log('parentReply',typeof parentReply);

            if (((arrAdditionalInfo.scraped||false) === true)&&((arrAdditionalInfo.dtOriginal||'') !== '')) {//it has been scrapped...
                dtCreation = arrAdditionalInfo.dtOriginal;
                arrAdditionalInfo.dtRealCreation = new Date().getTime();
                delete arrAdditionalInfo.dtOriginal;
            }

            reply.p(
                {
                    title: sTitle,
                    // URL template: skyhub.com/forum/topic#reply-name
                    URL: await URLHashHelper.getFinalNewURL( parentObject.p('URL') , (sTitle.length > 0 ? sTitle : hat()) , null , '#' ), //Getting a NEW URL
                    description: sDescription,
                    shortDescription: shortDescription,
                    authorId: (userAuthenticated !== null ? userAuthenticated.id : ''),
                    keywords: commonFunctions.convertKeywordsArrayToString(arrKeywords),
                    attachments: arrAttachments,
                    country: sCountry.toLowerCase(),
                    city: sCity.toLowerCase(),
                    language: sLanguage.toLowerCase(),
                    dtCreation: dtCreation !== '' ? Date.parse(dtCreation) : new Date().getTime(),
                    dtLastActivity: null,
                    nestedLevel: (parentReply !== null ? parentReply.p('nestedLevel') + 1 : 1),
                    addInfo: arrAdditionalInfo, //Additional information
                    parentReplyId: await MaterializedParentsHelper.getObjectId(parentReply),
                    parentId: await MaterializedParentsHelper.getObjectId(parent),
                    parents: (await MaterializedParentsHelper.findAllMaterializedParents(parent)).toString(),
                }
            );

            console.log('parentReplyDone',typeof reply);

            if (dbLatitude != -666) reply.p('latitude', dbLatitude);
            if (dbLongitude != -666) reply.p('longitude', dbLongitude);

            return new Promise( (resolve)=> {

                if (Object.keys(errorValidation).length !== 0 ){

                    resolve({result: false, errors: errorValidation});
                    return false;
                }

                reply.save(async (err) => {
                    if (err) {
                        console.log("==> Error Saving Reply");
                        console.log(reply.errors); // the errors in validation

                        resolve({result:false, errors: reply.errors });
                    } else {
                        console.log("Saving Reply Successfully");

                        await reply.keepURLSlug();
                        await VotingsHashList.initializeVoteInDB(reply.id, reply.p('parents'));
                        await RepliesSorter.initializeSorterInDB(reply.id, reply.p('dtCreation'));

                        NotificationsCreator.newReply(reply.p('parentId'), reply.p('title'), reply.p('description'), reply.p('URL'), '', userAuthenticated );
                        NotificationsSubscribersHashList.subscribeUserToNotifications(reply.p('authorId'), reply.p('parentId'), true);

                        await reply.keepParentsStatistics();

                        if ((arrAdditionalInfo.scraped||false) === true){ //it has been scrapped...

                        } else {

                            let SearchesHelper = require ('../../../searches/helpers/Searches.helper.js');
                            SearchesHelper.addReplyToSearch(null, reply); //async, but not awaited
                        }

                        //console.log(reply.getPublicInformation(userAuthenticated));

                        resolve( {result:true, reply: reply.getPublicInformation(userAuthenticated) });

                    }
                });

            });
        } catch (Exception){
            console.log('############# ERRROR AddReply',Exception.toString());
            return {result:false, message: ' error '};
        }


    },



}


