/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/16/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../../../DB/redis_nohm');
var modelIterator = require ('../../../common/model.iterator.ts');

var ForumModel = redis.nohm.model('UserModel', {
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
    idGenerator: function (callback){
        return modelIterator.generateCommonIterator(callback,"fm");
    },
    methods: { // optional

        getFullName : function () {
            return this.p('firstName') + ' ' + this.p('lastName');
        },

        getPublicInformation : function (){
            var properties = this.allProperties();

            properties.connected = this.getConnectedStatus();
            delete properties.password;
            delete properties.email;

            return properties;
        },

        getPrivateInformation : function (){
            var properties = this.allProperties();

            properties.connected = this.getConnectedStatus();
            delete properties.password;

            return properties;
        },

        getConnectedStatus : function () {

            var timeDiff = new Date().getTime() - this.p('dtLastActivity') ;

            /*console.log('calcuating diff time');
             console.log('time');
             console.log(new Date().getTime());
             console.log(this.p('dtLastActivity'));
             console.log(timeDiff);*/

            if (timeDiff / 1000 < 3 )
                return true;
            else
                return false;
        },

        // ... here you'll define your custom methods
    },
    //client: redis.someRedisClient // optional
});