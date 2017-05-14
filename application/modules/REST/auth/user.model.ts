var redis = require ('../../DB/redis_nohm');

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
        latitude : {
            type: 'number'
        },
        longitude : {
            type: 'number'
        },
        dtCreation: {
            type: 'timestamp'
        },
        dtLastActivity: {
            type: 'timestamp',
        },
        age: { type: 'number', },
        timeZone: { type: 'string', },
        gender: { type: 'string', },

        verified : {type : 'boolean'},

        idFacebook : { type: 'string', },
        idGoogle : { type: 'string', },
        idTwitter : { type: 'string', },
        idLinkedIn : { type: 'string', },
        idGitHub : { type: 'string', },
        idReddit : { type: 'string', },
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
        }

        // ... here you'll define your custom methods
    },
    //client: redis.someRedisClient // optional
});