/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/22/2017.
 * (C) BIT TECHNOLOGIES
 */

var redis = require ('../../../../DB/redis_nohm');
var nohmIterator = require ('../../../../DB/Redis/nohm/nohm.iterator.ts');

var TopicModel = redis.nohm.model('TopicModel', {

    idGenerator: function (callback){
        return nohmIterator.generateCommonIterator(callback,"topic");
    },

    properties: {
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
        },
        image: {  //the thumbnail
            type: 'string',
        },
        attachments: {
            type: 'json',
            //it contains link and  thumbnail
        },
        keywords : {
            type: 'string',
            /*validations: [   //not necessary
                'validateKeywords'
            ]*/
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
            type: 'string',     //ID,ID2,ID3
        },

        breadcrumbs: {
            type: 'json',
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
        },
        city: {
            type: 'string',
        },
        language: {
            type: 'string',
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

            var TopContentHelper = require ('./../../content/helpers/TopContent.helper.ts');
            return TopContentHelper.keepSortedObject(this.id, this.calculateHotnessCoefficient(), this.p('parents'), bDelete);

        },

        keepURLSlug : async function (sOldURL,  bDelete){

            var URLHashHelper = require ('../../../common/URLs/helpers/URLHash.helper.ts');
            return URLHashHelper.replaceOldURL(sOldURL, this.p('URL'), this.id, bDelete);
        }

    },
    //client: redis.redisClient.RedisClient, // the 2nd client to enable notifications
});

// redis.nohm.factory('TopicModel').subscribe('create', function (event) {
//     console.log('topic with id'+event.target.id+' was created and now looks like this:', event.target.properties);
//     console.log("previous", this);
// });
//
// redis.nohm.factory('TopicModel').subscribe('update', function (event) {
//     console.log('topic with id'+event.target.id+' was updated and now looks like this:', event.target.properties);
//     console.log("previous", this);
// });
//
// redis.nohm.factory('TopicModel').subscribe('delete', function (event) {
//     console.log('topic with id'+event.target.id+' was deleted and now looks like this:', event.target.properties);
//     console.log("previous", this);
// });
