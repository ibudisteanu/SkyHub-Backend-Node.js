var redis = require ('../../DB/redis_nohm');

var UserModel = redis.nohm.model('UserModel', {
    properties: {
        username: {
            type: 'string',
            unique: true,
            validations: [
                ['notEmpty']
            ]
        },
        email: {
            type: 'string',
            unique: true,
            validations: [
                ['notEmpty'],
                ['email']
            ]
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
                ['notEmpty']
            ]
        },
        lastName: {
            type: 'string',
            validations: [
                ['notEmpty']
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
        dtCreation: {
            type: 'timestamp'
        },
        dtLastActivity: {
            type: 'timestamp',
        }
    },
    methods: { // optional

        getFullName : function () {
            return this.p('firstName') + ' ' + this.p('lastName');
        },

        getPublicInformation : function (){
            var properties = this.allProperties();
            delete properties.password;
            delete properties.email;

            return properties;
        },

        getPrivateInformation : function (){
            var properties = this.allProperties();
            delete properties.password;

            return properties;
        }

        // ... here you'll define your custom methods
    },
    //client: redis.someRedisClient // optional
});