/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/26/2017.
 * (C) BIT TECHNOLOGIES
 */

let forumModel = require ('../models/Forum.model.js');
let commonFunctions = require ('../../../common/helpers/CommonFunctions.helper.js');
let URLHashHelper = require ('../../../common/URLs/helpers/URLHash.hashlist.js');
let MaterializedParentsHelper = require ('../../../../DB/common/materialized-parents/MaterializedParents.helper.js');
let SearchesHelper = require ('../../../searches/helpers/Searches.helper.js');
let ForumsSorter = require('../models/ForumsSorter.js');

let NotificationsCreator = require ('../../../notifications/NotificationsCreator.js');
let NotificationsSubscribersHashList = require ('./../../../notifications/subscribers/helpers/NotificationsSubscribers.hashlist.js');

let AllPagesList = require ('./../../content/all-pages/helpers/AllPages.list.js');

module.exports = {

    createDummyForum (iIndex){

        iIndex = iIndex || 0;

        return this.addForum("forum_"+iIndex,"userDummy_"+iIndex, "123456","Gigel",
            "Nume"+iIndex,"RO","Bucharest", "RO", "http://www.gravatar.com/avatar/ee4d1b570eff6ce63"+iIndex+"?default=wavatar&forcedefault=1",
            "http://www.hdfbcover.com/randomcovers/covers/never-stop-dreaming-quote-fb-cover.jpg");
    },

    /*
        FINDING & LOADING FORUM from ID, URL
     */
    async findForum(sRequest){

        console.log("Finding forum :::  " + sRequest);

        let forumFound = await this.findForumById(sRequest);

        if (forumFound !== null) return forumFound;
        else return await this.findForumByURL(sRequest);
    },

    async findForumById (sId){

        return new Promise( (resolve)=> {

            if ((typeof sId === 'undefined') || (sId === null) || (sId == []) )
                resolve(null);
            else
            var ForumModel  = redis.nohm.factory('ForumModel', sId, function (err, forum) {
                if (err) resolve (null);
                else resolve (ForumModel);
            });

        });
    },

    findForumByURL (sURL){

        sURL = sURL || "";
        return new Promise( (resolve)=> {
            if ((typeof sURL === 'undefined') || (sURL == []) || (sURL === null))
                resolve(null);
            else
                return null;

            let TopicModel = redis.nohm.factory('ForumModel');
            TopicModel.findAndLoad(  {URL: sURL }, function (err, topics) {
                if (topics.length) resolve(topics[0]);
                else resolve (null);
            });

        });
    },


    /*
     CREATING A NEW FORUM
     */
    async addForum (userAuthenticated, parent, sName, sTitle, sDescription, arrKeywords, sCountry, sCity, sLanguage, sIconPic, sCoverPic, sCoverColor, dbLatitude, dbLongitude, dtCreation, arrAdditionalInfo){

        if ((typeof dtCreation === 'undefined') || (dtCreation === null)) dtCreation = '';
        if ((typeof arrAdditionalInfo === 'undefined')) arrAdditionalInfo = {};

        sCountry = sCountry || ''; sCity = sCity || ''; sIconPic = sIconPic || ''; sCoverPic = sCoverPic || '';
        dbLatitude = dbLatitude || -666; dbLongitude = dbLongitude || -666;

        sLanguage = sLanguage || sCountry;
        parent = parent || '';
        sCoverColor = sCoverColor || ((1<<24)*Math.random()|0).toString(16);

        while (sCoverColor.length < 6) sCoverColor = sCoverColor + '0';

        let forum = redis.nohm.factory('ForumModel');
        let errorValidation = {};


        //get object from parent
        //console.log("addForum ===============", userAuthenticated);
        let parentObject = await MaterializedParentsHelper.findObject(parent);

        if ((sIconPic === '')&&(parentObject !== null))
            sIconPic = parentObject.p('iconPic');

        if ((sCoverPic === '') && (parentObject !== null))
            sCoverPic = parentObject.p('coverPic');

        if (((arrAdditionalInfo.scraped||false) === true)&&((arrAdditionalInfo.dtOriginal||'') !== '')) {//it has been scrapped...
            dtCreation = arrAdditionalInfo.dtOriginal;
            arrAdditionalInfo.dtRealCreation = new Date().getTime();
            delete arrAdditionalInfo.dtOriginal;
        }

        forum.p(
            {
                name: sName,
                title: sTitle,
                URL: await(URLHashHelper.getFinalNewURL('',sName,null)), //Getting a NEW URL
                description: sDescription,
                authorId: (userAuthenticated !== null ? userAuthenticated.id : ''),
                keywords: commonFunctions.convertKeywordsArrayToString(arrKeywords),
                iconPic: sIconPic,
                coverPic: sCoverPic,
                coverColor: sCoverColor,
                country: sCountry.toLowerCase(),
                city: sCity.toLowerCase(),
                language: sLanguage.toLowerCase(),
                dtCreation:  dtCreation !== '' ? Date.parse(dtCreation) : new Date().getTime(),
                dtLastActivity: null,
                addInfo: arrAdditionalInfo, //Additional information
                parentId: await MaterializedParentsHelper.getObjectId(parentObject),
                parents: (await MaterializedParentsHelper.findAllMaterializedParents(parent)).toString(),
                breadcrumbs: await MaterializedParentsHelper.createBreadcrumbs(parentObject),
            }
        );

        if (dbLatitude != -666) forum.p('latitude', dbLatitude);
        if (dbLongitude != -666) forum.p('longitude', dbLongitude);

        return new Promise( (resolve)=> {

            if (Object.keys(errorValidation).length !== 0 ){

                resolve({result: false, errors: errorValidation});
                return false;
            }

            forum.save(async function (err) {
                if (err) {
                    console.log("==> Error Saving Forum");
                    console.log(forum.errors); // the errors in validation

                    resolve({result:false, errors: forum.errors });
                } else {
                    console.log("Saving Forum Successfully");

                    await forum.keepURLSlug();
                    await ForumsSorter.initializeSorterInDB(forum.id, forum.p('dtCreation'));

                    NotificationsCreator.newForum(forum.p('parentId'), forum.p('title'), forum.p('description'), forum.p('URL'), '', userAuthenticated );
                    NotificationsSubscribersHashList.subscribeUserToNotifications(forum.p('authorId'), forum, true);

                    AllPagesList.keepAllPagesList(forum.p('parentId'), forum, false);

                    await forum.keepParentsStatistics(+1);

                    SearchesHelper.addForumToSearch(null, forum); //async, but not awaited

                    if ((arrAdditionalInfo.scraped||false) === true){ //it has been scrapped...

                    } else {

                    }



                    //console.log(forum.getPublicInformation(userAuthenticated));

                    resolve( {result:true, forum: forum.getPublicInformation(userAuthenticated) });

                }
            }.bind(this));

        });

    },



}


