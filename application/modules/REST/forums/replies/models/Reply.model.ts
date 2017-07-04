/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/22/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../../../DB/redis_nohm');
var nohmIterator = require ('../../../../DB/Redis/nohm/nohm.iterator.ts');

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

            properties.isOwner = this.isOwner(userAuthenticated);

            return properties;
        },

        isOwner : function (User){

            if (User.checkOwnership(this.p('authorId')))
                return true;

            return false;
        },

        calculateHotnessCoefficient : function (){

            var ScoreCoefficientHelper = require ('../../../../DB/common/score-coefficient/ScoreCoefficient.helper.ts');
            return ScoreCoefficientHelper.calculateHotnessScoreCoefficient(this);
        },

        keepSortedList : async function (bDelete){

            var TopRepliesHelper = require ('./../../content/helpers/TopReplies.helper.ts');
            return TopRepliesHelper.keepSortedObject(this.id, this.calculateHotnessCoefficient(), this.p('parentId'), bDelete);

        },

        keepURLSlug : async function (sOldURL,  bDelete){

            var URLHashHelper = require ('../../../common/URLs/helpers/URLHash.helper.ts');
            return URLHashHelper.replaceOldURL(sOldURL, this.p('URL'), this.id, bDelete);
        }

    },
    //client: redis.someRedisClient // optional
});