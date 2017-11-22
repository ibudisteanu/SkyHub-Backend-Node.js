/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/22/2017.
 * (C) BIT TECHNOLOGIES
 */

let redis = require ('DB/redis_nohm');
let nohmIterator = require ('DB/Redis/nohm/nohm.iterator.js');

import StatisticsHelper from 'REST/statistics/helpers/Statistics.helper.js';
import URLHashHelper from 'REST/common/URLs/helpers/URLHash.hashlist.js'
import SanitizeAdvanced from 'REST/common/helpers/SanitizeAdvanced'
import CommonFunctions from 'REST/common/helpers/CommonFunctions.helper.js'

let md5 = require ('md5');

var TopicModel = redis.nohm.model('TopicModel', {

    idGenerator: function (callback){
        return nohmIterator.generateCommonIterator(callback,"topic");
    },

    properties: {
        title: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 4
                }]

            ]
        },
        description: {
            type: 'string',
        },
        shortDescription:{
            type: 'string',
        },
        attachments: {
            type: 'json',
            //it contains link and  thumbnail
        },
        keywords : {
            type: 'string',
            /*validations: [   //not necessary
                'validateKeywords'
            ]*/
        },
        coverPic: {
            defaultValue: '',
            type: 'string',
        },
        authorId: {
            defaultValue: '',
            type: 'string',
            validations: [
                ['notEmpty'],
            ]
        },
        parentId: {
            defaultValue: '',
            type: 'string',
        },
        parents: {
            defaultValue: '',
            type: 'string',     //ID,ID2,ID3
        },

        breadcrumbs: {
            type: 'json',
        },

        addInfo:{
            type: 'json',
        },
        //additional information like:
        // {
        //     "scraped" : true,
        //     "originalURL" : "http://www.antena3.ro/politica/traian-basescu-statul-trebuie-sa-i-garanteze-lui-sebastian-ghita-imunitate-ca-sa-poata-vorbi-408633.html",
        //     "website" : "http://antena3.ro/",
        //     "websiteName" : "Antena3"
        // }

        /*
         COMMON PROPERTIES
         */
        URL: {
            type: 'string',
            // validations: [
            //     ['notEmpty'],
            //     ['length', {
            //         min: 2
            //     }],
            //     'validateUniqueURL',
            // ]
        },
        country: {
            type: 'string',
        },
        city: {
            type: 'string',
        },
        language: {
            type: 'string',
        },
        latitude : {type: 'number'},
        longitude : {type: 'number'},
        dtCreation: {type: 'timestamp'},
        dtLastActivity: {type: 'timestamp',},


    },

    methods: {

        getFullName : function () {
            return this.p('firstName') + ' ' + this.p('lastName');
        },

        getPublicInformation : function (userAuthenticated){
            let properties = this.allProperties();

            properties.description = SanitizeAdvanced.sanitizeAdvanced(properties.description);
            properties.shortDescription = SanitizeAdvanced.sanitizeAdvancedShortDescription(properties.shortDescription||properties.description, 512);

            properties.isOwner = this.isOwner(userAuthenticated);
            properties.keywords = CommonFunctions.convertKeywordsToArray(properties.keywords);

            //Scraping Gravatars
            if (((properties.addInfo.orgName||'')!=='') && ((properties.addInfo.orgAvatar|| '') === '')){

                //  wavatar Gravatar sample https://www.gravatar.com/avatar/00000000000000000000000000000000?d=wavatar&f=y
                //  documentation: https://en.gravatar.com/site/implement/images/

                let gravatarId = md5(properties.addInfo.orgName);
                properties.addInfo.orgAvatar = 'https://www.gravatar.com/avatar/'+gravatarId+'?d=wavatar&f=y';
            }

            return properties;
        },

        isOwner : function (User){

            if ((typeof(User !== 'undefined')&&(User !== null))&&(typeof User.checkOwnership !== 'undefined')&&(User.checkOwnership(this.p('authorId')))) return true;

            return false;
        },

        keepParentsStatistics : async function(value,  bDelete){

            await StatisticsHelper.keepParentsStatisticsUpdated(this.id, this.p('parents'), true, StatisticsHelper.updateTotalTopicsCounter.bind(StatisticsHelper), value, bDelete);

        },

        keepURLSlug : function (sOldURL,  bDelete){

            return URLHashHelper.replaceOldURL(sOldURL, this.p('URL'), this.id, bDelete, false );
        }

    },
    //client: redis.redisClient.RedisClient, // the 2nd client to enable notifications
});

// redis.nohm.factory('TopicModel').subscribe('create', function (event) {
//     console.log('topic with id'+event.target.id+' was created and now looks like this:', event.target.properties);
//     console.log("previous", this);
// });
//
// redis.nohm.factory('TopicModel').subscribe('update', function (event) {
//     console.log('topic with id'+event.target.id+' was updated and now looks like this:', event.target.properties);
//     console.log("previous", this);
// });
//
// redis.nohm.factory('TopicModel').subscribe('delete', function (event) {
//     console.log('topic with id'+event.target.id+' was deleted and now looks like this:', event.target.properties);
//     console.log("previous", this);
// });
