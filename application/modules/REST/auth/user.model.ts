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
            type: function (value) {
                return value + 'someSeed'; // and hash it of course, but to make this short that is omitted in this example
            },
            validations: [
                ['length', {
                    min: 6
                }]
            ]
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
        }
    },
    methods: { // optional
        // ... here you'll define your custom methods
    },
    //client: redis.someRedisClient // optional
});