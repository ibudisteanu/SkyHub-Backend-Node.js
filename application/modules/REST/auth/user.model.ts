var redis = require ('../../DB/redis_nohm');

module.exports =
    {
        UserGenderEnum: {
            MALE: 0,
            FEMALE: 1,
            NOT_SPECIFIED: 2,
        },

        UserRolesEnum: {
            NOT_REGISTERED: 0,
            USER: 3,
            MODERATOR: 5,
            ADMIN: 8,
            SYS_ADMIN: 666,
        }
    }

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

        getTimeZone : function (){
            return this.timeZone;
        },

        getGenderString : function (){

            switch (this.gender){
                case UserGenderEnum.FEMALE: return 'female';
                case UserGenderEnum.MALE: return 'male';
                case UserGenderEnum.NOT_SPECIFIED:
                default: return 'not specified';
            }
        },

        getRoleString : function (role){

            if (typeof role === "udnefined") role = this.role;

            switch (this.role){

                case UserRolesEnum.ADMIN: return 'admin';
                case UserRolesEnum.MODERATOR: return 'moderator';
                case UserRolesEnum.NOT_REGISTERED: return 'not registered';
                case UserRolesEnum.SYS_ADMIN: return 'system admin';
                case UserRolesEnum.USER: return 'user';
                default: return 'not specified';
            }
        },

        // ... here you'll define your custom methods
    },
    //client: redis.someRedisClient // optional
});