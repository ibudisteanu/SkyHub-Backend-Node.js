var redis = require ('../../../DB/redis_nohm');

var modelIterator = require ('../../common/model.iterator.ts');

var UserModel = redis.nohm.model('UserModel', {
    properties: {
        username: {
            type: 'string',
            unique: true,
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 4
                }]

            ]
        },
        email: {
            type: 'string',
            unique: true,
        },
        password: {
            defaultValue: '',
            type: 'string',
        },
        profilePic: {
            type: 'string',
        },
        coverPic: {
            type: 'string',
        },
        firstName: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 1
                }]

            ]
        },
        lastName: {
            type: 'string',
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 2
                }]
            ]
        },

        age: { type: 'number', },
        timeZone: { type: 'number', },
        gender: { type: "number", },

        role: { type: "number", },

        shortBio: { type: 'string', },

        verified : {type : 'boolean'},

        idFacebook : { type: 'string', unique: true, },
        idGoogle : { type: 'string', unique: true,},
        idTwitter : { type: 'string', unique: true,},
        idLinkedIn : { type: 'string', unique: true, },
        idGitHub : { type: 'string', unique: true,},
        idReddit : { type: 'string', unique: true,},

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
        return modelIterator.generateCommonIterator(callback,"us");
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