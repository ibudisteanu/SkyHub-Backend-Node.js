/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/22/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../../../DB/redis_nohm');
var modelIterator = require ('../../../common/model.iterator.ts');

var ReplyModel = redis.nohm.model('ReplyModel', {

    idGenerator: function (callback){
        return modelIterator.generateCommonIterator(callback,"rep");
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
            unique: true,
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 4
                }]

            ]
        },
        authorId: {
            defaultValue: '',
            type: 'string',
            validations: [
                ['notEmpty'],
            ]
        },
        replyParentId: {
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

        breadCrumbs: {
            type: 'json',
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
        }

    },
    //client: redis.someRedisClient // optional
});