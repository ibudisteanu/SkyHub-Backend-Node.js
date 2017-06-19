/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/16/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../../../DB/redis_nohm');
var nohmIterator = require   ('../../../../DB/Redis/nohm/nohm.iterator.ts');

var ForumModel = redis.nohm.model('ForumModel', {

    idGenerator: function (callback){
        return nohmIterator.generateCommonIterator(callback,"frm");
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
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 2
                }]
            ],
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

        getPublicInformation : function (){
            var properties = this.allProperties();

            return properties;
        },

        getPrivateInformation : function (){
            var properties = this.allProperties();

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

            var TopForumsHelper = require ('./../../content/helpers/TopForums.helper.ts');
            return TopForumsHelper.keepSortedObject(this.id, this.calculateHotnessCoefficient(), this.p('parents'), bDelete);

        },

        keepURLSlug : async function (sOldURL,  bDelete){

            var URLHashHelper = require ('../../../common/URLs/helpers/URLHash.helper.ts');
            return URLHashHelper.replaceOldURL(sOldURL, this.p('URL'), this.id, bDelete);
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
