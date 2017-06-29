var redis = require ('../../../DB/redis_nohm');
var nohmIterator = require ('../../../DB/Redis/nohm/nohm.iterator.ts');
var md5 = require ('md5');

var UserModel = redis.nohm.model('UserModel', {
    properties: {
        username: {
            type: 'string',
            unique: true,
            validations: [
                ['notEmpty'],
                ['length', {
                    min: 4
                }],
                'validateUsername',
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
        timeZone: { type: 'number', },
        dtCreation: {type: 'timestamp'},
        dtLastActivity: {type: 'timestamp',},

    },
    idGenerator: function (callback){
        return nohmIterator.generateCommonIterator(callback,"user");
    },
    methods: { // optional

        getFullName : function () {
            return this.p('firstName') + ' ' + this.p('lastName');
        },

        getAvatar : function (){


            if ( this.p('profilePic').length > 0 )
                return this.p('profilePic');

            /*
                wavatar Gravatar sample https://www.gravatar.com/avatar/00000000000000000000000000000000?d=wavatar&f=y
                documentation: https://en.gravatar.com/site/implement/images/
             */

            let gravatarId = md5(this.id);
            return 'https://www.gravatar.com/avatar/'+gravatarId+'?d=wavatar&f=y';

        },

        getPublicInformation : function (){
            var properties = this.allProperties();

            properties.connected = this.getConnectedStatus();
            properties.profilePic = this.getAvatar();
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

        calculateHotnessCoefficient : function (){

            var ScoreCoefficientHelper = require ('../../../DB/common/score-coefficient/ScoreCoefficient.helper.ts');

            return ScoreCoefficientHelper.calculateHotnessScoreCoefficient(this);
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