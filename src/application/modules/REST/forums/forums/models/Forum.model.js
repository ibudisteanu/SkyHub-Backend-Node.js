/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/16/2017.
 * (C) BIT TECHNOLOGIES
 */
import * as redis from 'DB/redis_nohm'
import SanitizeAdvanced from 'REST/common/helpers/SanitizeAdvanced'
import CommonFunctions from 'REST/common/helpers/CommonFunctions.helper.js'
import StatisticsHelper from 'REST/statistics/helpers/Statistics.helper.js';

var nohmIterator = require   ('DB/Redis/nohm/nohm.iterator.js');

import URLHashHelper from 'REST/common/URLs/helpers/URLHash.hashlist.js';



var ForumModel = redis.nohm.model('ForumModel', {

    idGenerator: function (callback){
        return nohmIterator.generateCommonIterator(callback,"forum");
    },

    properties: {
        name: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 3
                }]

            ]
        },
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
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 5
                }]

            ]
        },
        keywords : {
            type: 'string',
            validations: [
                'validateKeywords'
            ]
        },
        authorId: {
            defaultValue: '',
            type: 'string',
            validations: [
                'validateExistingAuthorId'
            ]
        },
        parentId: {
            defaultValue: '',
            type: 'string',
        },
        parents: {
            defaultValue: '',
            type: 'string',
        },

        breadcrumbs: {
            type: 'json',
        },

        addInfo:{
            type: 'json',
        },

        iconPic: {
            defaultValue: '',
            type: 'string',
        },

        coverPic: {
            defaultValue: '',
            type: 'string',
        },

        coverColor:{
            defaultValue: '',
            type: 'string',
        },

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
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 1
                }]
            ]
        },
        city: {
            type: 'string',
            // validations: [
            //     ['notEmpty'],
            //     ['length', {
            //         min: 2
            //     }]
            // ],
        },
        language: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 2
                }]
            ]
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
            var properties = this.allProperties();

            properties.description = SanitizeAdvanced.sanitizeAdvanced(properties.description);
            properties.shortDescription = SanitizeAdvanced.sanitizeAdvancedShortDescription(properties.description, 512);

            properties.keywords = CommonFunctions.convertKeywordsToArray(properties.keywords);

            properties.isOwner = this.isOwner(userAuthenticated);

            return properties;
        },

        isOwner : function (User){

            if ((typeof(User !== 'undefined')&&(User !== null))&&(typeof User.checkOwnership !== 'undefined')&&(User.checkOwnership(this.p('authorId')))) return true;

            return false;
        },


        keepParentsStatistics : async function(value,  bDelete){

            await StatisticsHelper.keepParentsStatisticsUpdated(this.id, this.p('parents'), true, StatisticsHelper.updateTotalForumsCounter.bind(StatisticsHelper), value, bDelete);

        },

        keepURLSlug : function (sOldURL,  bDelete){

            return URLHashHelper.replaceOldURL(sOldURL, this.p('URL'), this.id, bDelete, false );
        }

    },
    //client: redis.redisClient.RedisClient, // the 2nd client to enable notifications
});
//
// redis.nohm.factory('ForumModel').subscribe('create', function (event) {
//     console.log('ForumModel with id'+event.target.id+' was created and now looks like this:', event.target.properties);
//     console.log("previous", this);
// });
//
// redis.nohm.factory('ForumModel').subscribe('update', function (event) {
//     console.log('ForumModel with id'+event.target.id+' was updated and now looks like this:', event.target.properties);
//     console.log("previous", this);
// });
//
// redis.nohm.factory('ForumModel').subscribe('delete', function (event) {
//     console.log('ForumModel with id'+event.target.id+' was deleted and now looks like this:', event.target.properties);
//     console.log("previous", this);
// });
//
