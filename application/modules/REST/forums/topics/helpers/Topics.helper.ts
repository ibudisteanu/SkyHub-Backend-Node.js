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
    async addTopic (userAuthenticated, parent,  sTitle, sImage, sDescription, arrAttachments, arrKeywords, sCountry, sCity, sLanguage, dbLatitude, dbLongitude){

        sCountry = sCountry || ''; sCity = sCity || '';
        dbLatitude = dbLatitude || -666; dbLongitude = dbLongitude || -666;

        sLanguage = sLanguage || sCountry;
        parent = parent || '';

        var topic = redis.nohm.factory('TopicModel');
        var errorValidation = {};

        //get object from parent
        //console.log("addTopic ===============", userAuthenticated);

        topic.p(
            {
                title: sTitle,
                URL: await(URLHashHelper.getFinalNewURL('',sTitle,null)), //Getting a NEW URL
                image: sImage,
                attachments: arrAttachments,
                description: sDescription,
                authorId: (userAuthenticated !== null ? userAuthenticated.id : ''),
                keywords: commonFunctions.convertKeywordsArrayToString(arrKeywords),
                country: sCountry.toLowerCase(),
                city: sCity.toLowerCase(),
                language: sLanguage.toLowerCase(),
                dtCreation: new Date(),
                dtLastActivity: new Date(),
                parentId: await MaterializedParentsHelper.getObjectId(parent),
                parents: (await MaterializedParentsHelper.findAllMaterializedParents(parent)).toString(),
                breadcrumbs: await MaterializedParentsHelper.createBreadcrumbs(parent),
            }
        );

        if (dbLatitude != -666) topic.p('latitude', dbLatitude);
        if (dbLongitude != -666) topic.p('longitude', dbLongitude);

        return new Promise( (resolve)=> {

            if (Object.keys(errorValidation).length !== 0 ){

                resolve({result: false, errors: errorValidation});
                return false;
            }

            topic.save(function (err) {
                if (err) {
                    console.log("==> Error Saving Topic");
                    console.log(topic.errors); // the errors in validation

                    resolve({result:false, errors: topic.errors });
                } else {
                    console.log("Saving Forum Successfully");

                    topic.keepURLSlug().then((answer)=> {
                        topic.keepSortedList().then ((answer)=>{
                            console.log(topic.getPrivateInformation());

                            resolve( {result:true, topic: topic.getPrivateInformation() });
                        });
                    });
                }
            });

        });

    },


}

