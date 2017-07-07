/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/7/2017.
 * (C) BIT TECHNOLOGIES
 */

var mongoose = require('mongoose');

var UserModel = mongoose.model('users',{});

var UsersHelper = require ('../../REST/users/auth/helpers/Users.helper.ts');
var UserProperties = require ('../../REST/users/auth/models/User.properties.ts');

var ForumsCtrl = require ('../../REST/forums/forums/helpers/Forums.helper.ts');
var TopicsCtrl = require ('../../REST/forums/topics/helpers/Topics.helper.ts');
var RepliesCtrl = require ('../../REST/forums/replies/helpers/Replies.helper.ts');
var VotingCtrl = require ('../../REST/Voting/helpers/Votings.helper.ts');

class MongoImporter {

    async importUsers(){

        UserModel.find({}, async function (err, users){

            //console.log(users);

            for (let i=0; i<users.length; i++){
                let user = users[i];

                //console.log(user);

                user = user._doc;

                // Object.keys(user).map(function(key, index) {
                //     console.log(key, user[key]);
                // });

                // console.log(1,user.City);
                // console.log(2, user['First Name']);

                let gender = UserProperties.UserGenderEnum.NOT_SPECIFIED;
                if (user.Gender === true) gender = UserProperties.UserGenderEnum.MALE;
                else gender = UserProperties.UserGenderEnum.FEMALE;

                let password = {};
                if ((typeof user.Password !== 'undefined')&&(user.Password.length > 5))
                    password = {type:'string', value: user.Password};

                if ((typeof user['3rdPartiesSocialNet'] !== 'undefined')){
                    password = {
                        type:'oauth2',
                        value:{
                            socialNetwork : user['3rdPartiesSocialNet'][0].Name,
                            socialNetworkUserId : user['3rdPartiesSocialNet'][0].Id,
                            socialNetworkData : {
                                name: user['3rdPartiesSocialNet'][0].Name,
                                link: user['3rdPartiesSocialNet'][0].Link,
                            },
                            accessToken : '@@@no token',
                        },
                    }
                }


                if (typeof user.Username === 'undefined'){

                    user.Username = user['First Name'] + '_' + user['Last Name'];
                }

                if (user.Username.length < 3){

                    console.log('%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log(user);

                }


                 await UsersHelper.registerUser(user.Email, user.Username, password, user['First Name'], user['Last Name'],
                                               user.Country||'none', user.City||'none', '', user.AvatarPicture, '', -666, -666, user.Biography, user.Age||0, user.TimeZone, gender, user.Verified);

            }

        });

    }

    async importForums(){

    }

    async importTopics(){

    }

    async importReplies(){

    }

    run(){

        console.log('running Mongo Importer');

        return new Promise((resolve)=>{
            mongoose.connect(constants.Mongo_connection_URI, { useMongoClient: true }).then(
                ()=>{
                    let users = this.importUsers();
                    let forums = this.importForums();
                    let topics = this.importTopics();
                    let replies = this.importReplies();

                    resolve({

                        status: 'MERGE',
                    })
                },
                err =>{
                    resolve({
                            status: err,
                        });
                },
            );
        });

        console.log('running Mongo Importer...');

    }
}

module.exports = new MongoImporter();