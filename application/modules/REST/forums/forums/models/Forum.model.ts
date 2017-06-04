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
        title: {
            type: 'string',
            unique: true,
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 4
                }]

            ]
        },
        URL: {
            type: 'string',
            unique: true,
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
                ['notEmpty'],
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

        breadCrumbs: {
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
        timeZone: { type: 'number', },
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

        keepSortedList : function (bDelete){

            var TopContentHelper = require ('../../content/helpers/TopContent.helper.ts');

            return TopContentHelper.sortedList.keepSortedObject(this.id, this.calculateHotnessCoefficient(), this.p('parents'), bDelete);

        },

    },
    //client: redis.someRedisClient // optional
});