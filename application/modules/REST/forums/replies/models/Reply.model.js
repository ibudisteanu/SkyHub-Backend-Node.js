/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/22/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../../../DB/redis_nohm');
var nohmIterator = require ('../../../../DB/Redis/nohm/nohm.iterator.js');

var StatisticsHelper = require('../../../statistics/helpers/Statistics.helper.js');
var SanitizeAdvanced = require('../../../common/helpers/SanitizeAdvanced.js');

var ReplyModel = redis.nohm.model('ReplyModel', {

    idGenerator: function (callback){
        return nohmIterator.generateCommonIterator(callback,"reply");
    },

    properties: {
        title: {
            type: 'string',
        },
        description: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 4
                }]
            ]
        },
        shortDescription:{
            type: 'string',
        },
        nestedLevel:{
            type: 'number',
        },
        attachments: {
            type: 'json',
            //it contains link and  thumbnail
        },
        keywords : {
            type: 'string', //no validation for keywords
        },
        authorId: {
            defaultValue: '',
            type: 'string',
            validations: [
                ['notEmpty'],
            ]
        },
        parentReplyId: {
            defaultValue: '',
            type: 'string',
        },
        parentId: {
            defaultValue: '',
            type: 'string',
        },
        parents: {
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
        country: {type: 'string', }, //country, city, language, latitude, longtitude, are not required...
        city: { type: 'string', },
        language: { type: 'string' },
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
            properties.shortDescription = SanitizeAdvanced.sanitizeAdvancedShortDescription(properties.shortDescription||properties.description, 512);

            properties.isOwner = this.isOwner(userAuthenticated);

            return properties;
        },

        isOwner : function (User){

            if ((typeof(User !== 'undefined')&&(User !== null))&&(typeof User.checkOwnership !== 'undefined')&&(User.checkOwnership(this.p('authorId')))) return true;

            return false;
        },


        keepParentsStatistics : async function(value,  bDelete){

            await StatisticsHelper.keepParentsStatisticsUpdated(this.id, this.p('parents'), true, StatisticsHelper.updateTotalRepliesCounter.bind(StatisticsHelper), value, bDelete);
            await StatisticsHelper.updateRepliesCounter(this.p('parentId'), value);

        },

        keepURLSlug : function (sOldURL,  bDelete){

            var URLHashHelper = require ('../../../common/URLs/helpers/URLHash.hashlist.js');
            return URLHashHelper.replaceOldURL(sOldURL, this.p('URL'), this.id, bDelete, false );
        }

    },
    //client: redis.someRedisClient // optional
});