/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/26/2017.
 * (C) BIT TECHNOLOGIES
 */

var topicModel = require ('./../models/Topic.model.ts');
var commonFunctions = require ('../../../common/helpers/common-functions.helper.ts');
var URLHashHelper = require ('../../../common/URLs/helpers/URLHash.helper.ts');
var MaterializedParentsHelper = require ('../../../../DB/common/materialized-parents/MaterializedParents.helper.ts');

module.exports = {

    createDummyForum (iIndex){

        iIndex = iIndex || 0;

        return this.addTopic("topic_"+iIndex,"userDummy_"+iIndex, "123456","Gigel",
            "Nume"+iIndex,"RO","Bucharest", "RO", "http://www.gravatar.com/avatar/ee4d1b570eff6ce63"+iIndex+"?default=wavatar&forcedefault=1",
            "http://www.hdfbcover.com/randomcovers/covers/never-stop-dreaming-quote-fb-cover.jpg");
    },

    /*
     FINDING & LOADING FORUM from ID, URL
     */
    async findTopic(sRequest){

        console.log("Finding topic :::  " + sRequest);

        var topicFound = await this.findTopicById(sRequest);

        if (topicFound !== null) return topicFound;
        else return await this.findTopicByURL(sRequest);
    },

    async findTopicById (sId){

        return new Promise( (resolve)=> {

            if ((typeof sId === 'undefined') || (sId == []) || (sId === null))
                resolve(null);
            else
                var TopicModel  = redis.nohm.factory('TopicModel', sId, function (err, forum) {
                    if (err) resolve (null);
                    else resolve (TopicModel);
                });

        });
    },

    findTopicByURL (sURL){

        sURL = sURL || "";
        return new Promise( (resolve)=> {
            if ((typeof sURL === 'undefined') || (sURL == []) || (sURL === null))
                resolve(null);
            else
                return null;

            var TopicModel = redis.nohm.factory('ForumModel');
            TopicModel.findAndLoad(  {URL: sURL }, function (err, topics) {
                if (topics.length) resolve(topics[0]);
                else resolve (null);
            });

        });
    },


    /*
     CREATING A NEW Topic
     */
    async addTopic (userAuthenticated, parent, sName, sTitle, sDescription, arrKeywords, sCountry, sCity, sLanguage, sIconPic, sCoverPic, sCoverColor, dbLatitude, dbLongitude, iTimeZone){

        sCountry = sCountry || ''; sCity = sCity || ''; sIconPic = sIconPic || ''; sCoverPic = sCoverPic || '';
        dbLatitude = dbLatitude || -666; dbLongitude = dbLongitude || -666; iTimeZone = iTimeZone || 0;

        sLanguage = sLanguage || sCountry;
        parent = parent || '';
        sCoverColor = sCoverColor || ((1<<24)*Math.random()|0).toString(16);

        while (sCoverColor.length < 6) sCoverColor = sCoverColor + '0';

        var forum = redis.nohm.factory('ForumModel');
        var errorValidation = {};


        //get object from parent
        console.log("addForum ===============", userAuthenticated);

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
                dtCreation: new Date(),
                dtLastActivity: new Date(),
                timeZone : iTimeZone,
                parentId: await MaterializedParentsHelper.getObjectId(parent),
                parents: (await MaterializedParentsHelper.findAllMaterializedParents(parent)).toString(),
            }
        );

        if (dbLatitude != -666) forum.p('latitude', dbLatitude);
        if (dbLongitude != -666) forum.p('longitude', dbLongitude);

        return new Promise( (resolve)=> {

            if (Object.keys(errorValidation).length !== 0 ){

                resolve({result: false, errors: errorValidation});
                return false;
            }

            forum.save(function (err) {
                if (err) {
                    console.log("==> Error Saving Forum");
                    console.log(forum.errors); // the errors in validation

                    resolve({result:false, errors: forum.errors });
                } else {
                    console.log("Saving Forum Successfully");

                    forum.keepURLSlug().then((answer)=> {
                        forum.keepSortedList().then ((answer)=>{
                            console.log(forum.getPrivateInformation());

                            resolve( {result:true, forum: forum.getPrivateInformation() });
                        });
                    });
                }
            });

        });

    },



}


