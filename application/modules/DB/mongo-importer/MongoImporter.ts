/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/7/2017.
 * (C) BIT TECHNOLOGIES
 */

var mongoose = require('mongoose');

var UserModel = mongoose.model('users',{}, 'users');
var SiteCategoryModel = mongoose.model('SiteCategories',{ },'SiteCategories');
var ForumModel = mongoose.model('Forums',{ },'Forums');
var TopicModel = mongoose.model('Topics',{ },'ForumTopics');
var ReplyModel = mongoose.model('Replies',{ },'Replies');

var UsersHelper = require ('../../REST/users/auth/helpers/Users.helper.ts');
var UserProperties = require ('../../REST/users/auth/models/User.properties.ts');
var SessionsHashList = require ('./../../REST/users/auth/sessions/helpers/SessionsHashList.helper.ts');

var ForumsHelper = require ('../../REST/forums/forums/helpers/Forums.helper.ts');
var TopicsHelper = require ('../../REST/forums/topics/helpers/Topics.helper.ts');
var RepliesHelper = require ('../../REST/forums/replies/helpers/Replies.helper.ts');
var VotingsHelper = require ('../../REST/voting/helpers/Votings.helper.ts');
var StatisticsHelper = require ('../../REST/statistics/helpers/Statistics.helper.ts');
var VoteType = require ('./../../REST/voting/models/VoteType.js');

var newUsers = [];
var newCategories = [];
var newForums = [];
var newTopics = [];
var newReplies = [];

class MongoImporter {

     fixMongoImageURL(s){

        s = s.replace("http://skyhub.me/uploads-images-avatars-forums-icons-","http://myskyhub.ddns.net:4000/uploads/images/forums/icons/");
        s = s.replace("http://skyhub.me/uploads-images-avatars-forums-covers-","http://myskyhub.ddns.net:4000/uploads/images/forums/covers/");
        s = s.replace("http://skyhub.me/uploads-images-avatars-","http://myskyhub.ddns.net:4000/uploads/images/avatars/");
        s = s.replace("http://skyhub.me/uploads-images-forums-covers-","http://myskyhub.ddns.net:4000/uploads/images/forums/covers/");
        s = s.replace("http://skyhub.me/uploads-images-forums-icons-","http://myskyhub.ddns.net:4000/uploads/images/forums/icons/");
        s = s.replace("http://skyhub.me/uploads-images-","http://myskyhub.ddns.net:4000/uploads/images/avatars/");
        s = s.replace("http://skyhub.me/uploads","http://myskyhub.ddns.net:4000/uploads/avatars");

        return s;
    }

    async findUser(oldId){
        for (let i=0; i<newUsers.length; i++)
            if ((typeof newUsers[i] !== 'undefined')&&(typeof oldId !== 'undefined')&&(newUsers[i].oldId.toString() === oldId.toString()))
                return newUsers[i].user;

        return null;
    }

    async findCategory(oldId){
        for (let i=0; i<newCategories.length; i++)
            if ((typeof newCategories[i] !== 'undefined')&&(typeof oldId !== 'undefined')&&(newCategories[i].oldId.toString() === oldId.toString()))
                return newCategories[i].category;

        return null;
    }

    async findForum(oldId){
        for (let i=0; i<newForums.length; i++)
            if ((typeof newForums[i] !== 'undefined')&&(typeof oldId !== 'undefined')&&(newForums[i].oldId.toString() === oldId.toString()))
                return newForums[i].forum;

        return null;
    }

    async findTopic(oldId){
        for (let i=0; i<newTopics.length; i++)
            if ((typeof newTopics[i] !== 'undefined')&&(newTopics[i].oldId !== 'undefined')&&(typeof oldId !== 'undefined')&&(newTopics[i].oldId.toString() === oldId.toString()))
                return newTopics[i].topic;

        return null;
    }

    async findReply(oldId){
        for (let i=0; i<newReplies.length; i++)
            if ((typeof newReplies[i] !== 'undefined')&&(typeof newReplies[i].oldId !== 'undefined')&&(typeof oldId !== 'undefined')&&(newReplies[i].oldId.toString() === oldId.toString()))
                return newReplies[i].reply;

        return null;
    }

    async importUsers(){

        let users = await UserModel.find({});

        console.log(users.length);
        let count = 0;

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

            let avatar = this.fixMongoImageURL(user.AvatarPicture||'');
            let cover = this.fixMongoImageURL(user.CoverImage||'');


            let newUser = await UsersHelper.registerUser(user.Email, user.Username, password, user['First Name'], user['Last Name'],
                                                         user.Country||'none', user.City||'none', '', avatar, cover, user.latitude, user.longtitude, user.Biography, user.Age||0, user.TimeZone, gender, user.Verified, user.CreationDate||'', user.CreationDate||'');

            //console.log('##############', newUser);
            if (newUser.result === true){
                count++;
                newUsers.push({oldId: user._id, id: newUser.user.id, user: newUser.user});
                if ((typeof user.Credential !== 'undefined')&&(user.Credential.length > 3)){
                    await SessionsHashList.addSession(newUser, user.Credential );
                }
            }

        }

        return (count);

    }

    async importSiteCategories(){

        let categories = await SiteCategoryModel.find({});

        //console.log('@@@ CATEGORIES',categories);

        let count = 0; let queue = [];
        for (let i=0; i<categories.length; i++){
            let category = categories[i]._doc;

            if ((typeof category.Parent === 'undefined')||(category.Parent === '')){
                queue.push(category);
            }

        }

        console.log("@@@@ CATEGORIES QUEUE", queue.length);

        let j = 0;
        while (j < queue.length ) {
            let category = queue[j];

            let user = await this.findUser(category.AuthorId);
            let parentCategory = await this.findCategory(category.Parent);

            if ((typeof user === "undefined")||(user === null))
                user = await newUsers[0].user;

            // console.log(user);
            // console.log(parentCategory);
            // console.log(category.Name);

            if ((typeof parentCategory !== 'undefined')&&(parentCategory !== null)&&(typeof parentCategory.id !== 'undefined')) parentCategory = parentCategory.id.toString();

            let icon = '';
            if (((typeof category.Image !== 'undefined'))&&(category.Image.indexOf("http") >= 0)) icon = category.Image;

            icon = this.fixMongoImageURL(icon);
            let cover = this.fixMongoImageURL(category.CoverImage||'');


            let answer = await ForumsHelper.addForum(user, parentCategory, category.Name||'', category.ShortDescription||'', category.Description||'', category.InputKeywords||[], user.country, user.city, '', icon||'', cover||'', '', -666, -666, category.CreationDate||'');

            if (answer.result === true){
                count++;
                newCategories.push({oldId: category._id, id: answer.forum.id, category: answer.forum});
            }

            for (let i=0; i<categories.length; i++){
                let category2 = categories[i]._doc;

                if ((typeof category2 !== 'undefined')&&(typeof category2.Parent !== 'undefined')&&(typeof category._id !== 'undefined')&&(category2.Parent.toString() === category._id.toString())){

                    queue.push(category2);
                }
            }

            j++;
        }


        return (count);

    }


    async importForums(){
        let forums = await ForumModel.find({});
        let count = 0;

        for (let i=0; i<forums.length; i++){
            let forum = forums[i]._doc;

            let user = await this.findUser(forum.AuthorId);
            let parentCategory = await this.findCategory(forum.ParentCategory);

            if ((typeof user === "undefined")||(user === null))
                user = await newUsers[0].user;

            if ((typeof parentCategory !== 'undefined')&&(parentCategory !== null)&&(typeof parentCategory.id !== 'undefined')) parentCategory = parentCategory.id.toString();
            else parentCategory = '';

            let icon = '';
            if (((typeof forum.Image !== 'undefined'))&&(forum.Image.indexOf("http") >= 0)) icon = forum.Image;

            icon = this.fixMongoImageURL(icon);
            let cover = this.fixMongoImageURL(forum.CoverImage||'');

            let newForum = await ForumsHelper.addForum(user, parentCategory, forum.Name||'', forum.Description||'', forum.DetailedDescription||'', forum.InputKeywords, user.Country||'none', user.City||'none', '', icon||'', cover||'', '', user.latitude, user.longtitude);

            //console.log('##############', newUser);
            if (newForum.result === true){
                count++;
                newForums.push({oldId: forum._id, id: newForum.forum.id, forum: newForum.forum});
            }

        }

        return (count);
    }

    async importTopics(){
        let topics = await TopicModel.find({});
        let count = 0;

        for (let i=0; i<topics.length; i++){
            let topic = topics[i]._doc;

            let user = await this.findUser(topic.AuthorId);
            let parentCategory = await this.findCategory(topic.ParentSiteCategoryId);
            let parentForum = await this.findForum(topic.ParentForumId);

            if ((typeof user === "undefined")||(user === null))
                user = await newUsers[0].user;

            if ((typeof parentCategory !== 'undefined')&&(parentCategory !== null)&&(typeof parentCategory.id !== 'undefined')) parentCategory = parentCategory.id.toString();
            else parentCategory = '';

            if ((typeof parentForum !== 'undefined')&&(parentForum !== null)&&(typeof parentForum.id !== 'undefined')) parentForum = parentForum.id.toString();
            else parentForum = '';

            if (parentForum === '') parentForum = parentCategory;

            let attachments = [];

            let image = topic.Image||'';
            image = this.fixMongoImageURL(image);

            if ((typeof topic.Image !== 'undefined')&&(topic.Image.indexOf("http") >= 0))
                attachments = [{
                        type: 'file',
                        typeFile: 'image/jpeg',
                        url: image,
                        img: image,
                        title: topic.ImageAlt,
                    }
                ];
            if ((typeof topic.ImagesData !== 'undefined')){

                let images = topic.ImagesData.Images;
                Object.keys(images).map(function(key, index) {

                    image = images[key].src||'';
                    image = this.fixMongoImageURL(image);

                    if ((images[key].src||'').indexOf('http') >= 0)
                        attachments = [{
                            type: 'file',
                            typeFile: 'image/jpeg',
                            url: image,
                            img: image,
                            title: images[key].alt||images[key].title||images[key].description,
                        }];
                }.bind(this));
            }

            let cover = this.fixMongoImageURL(topic.CoverImage||'');

            //console.log('parents:', parentForum, parentCategory, typeof parentForum, typeof parentCategory);
            let newTopic = await TopicsHelper.addTopic(user, parentForum||parentCategory, topic.Title, topic.BodyCode, attachments, cover||'', topic.InputKeywords, user.Country||'none', user.City||'none', '', user.latitude, user.longtitude, topic.CreationDate||'', topic.findObject||{});

            if (newTopic.result === true){
                count++;
                newTopics.push({oldId: topic._id, id: newTopic.topic.id, topic: newTopic.topic});

                if (typeof topic.Vote !== 'undefined')
                    await this.importVote(newTopic.topic.id, topic.Vote);

                if (typeof topic.Visitors !== 'undefined')
                    await this.importVisitors(newTopic.topic.id, topic.Visitors);
            }

        }

        return (count);
    }

    async importReply(parent, reply){

        try {
            let count = 1;

            let user = await this.findUser(reply.AuthorId);

            if ((typeof user === "undefined") || (user === null))
                user = await newUsers[0].user;

            let parentReply = await this.findReply(reply.AttachedParentId);
            if ((typeof parentReply !== 'undefined') && (parentReply !== null) && (typeof parentReply.id !== 'undefined')) parentReply = parentReply.id.toString();
            else parentReply = '';

            console.log('@@reply: ', reply._id);

            let attachments = [];

            let newReply = await RepliesHelper.addReply(user, parent, parentReply, reply.Title, reply.MessageCode, attachments, [], user.Country || 'none', user.City || 'none', '', user.latitude, user.longtitude, reply.CreationDate||'');

            console.log('@@reply_finished: ', newReply.result, (newReply.result ? newReply.reply.id : ' no id') );

            if (newReply.result === true) {
                count++;
                newReplies.push({oldId: reply._id, id: newReply.reply.id, reply: newReply.reply});

                if (typeof reply.Vote !== 'undefined')
                    await this.importVote(newReply.reply.id, reply.Vote);
            }

            if ((typeof reply.Children !== 'undefined') && (reply.Children !== null))
                for (let i = 0; i < reply.Children.length; i++) {

                    newReply = reply.Children[i];

                    if (newReply !== null)
                        count += await this.importReply(parent, newReply);

                }



            return count;
        }
        catch (Exception){
            console.log('########## Error....', MongoImporter, Exception.toString());
        }
    }

    async importReplies(){

        let replies = await ReplyModel.find({});
        let count = 0;

        for (let i=0; i<replies.length; i++){

            let reply = replies[i]._doc;

            let parent = await this.findTopic(reply.AttachedParentId);
            if ((typeof parent !== 'undefined')&&(parent !== null)&&(typeof parent.id !== 'undefined')) parent = parent.id.toString();
            else parent = '';

            if (parent === ''){
                console.log('Parent not found: ',i, reply.AttachedParentId);
            } else
            count += await this.importReply(parent, reply);

        }

        return (count);
    }

    async importVote(parent, voteMongo){

        if (typeof voteMongo.Votes !== 'undefined')
            for (let i=0; i<voteMongo.Votes.length; i++){

                let user = await this.findUser(voteMongo.Votes[i].AuthorId);

                if ((typeof user === "undefined") || (user === null))
                    user = await newUsers[0].user;

                let voteType = VoteType.VOTE_NONE;
                switch (voteMongo.Votes[i].VoteValue){
                    case 1: //const votedUp=1;
                    case 4: //const votedMarkedUp=4;
                    case 3: //const votedMarked=3;
                        voteType = VoteType.VOTE_UP;
                        break;
                    case 2: //const votedDown=2;
                    case 5: //const votedMarkedDown=5;
                        voteType = VoteType.VOTE_DOWN;
                        break;
                }

                await VotingsHelper.submitVote(parent, user, voteType);

            }

    }

    async importVisitors(parentId, visitorsMongo){

        await StatisticsHelper.setManuallyPageViewsCounter(parentId, parseInt(visitorsMongo.Views));

        if (typeof visitorsMongo.IPVisitors !== 'undefined')
            for (let i=0; i<visitorsMongo.IPVisitors.length; i++){
                await StatisticsHelper.addUniqueVisitorCounter(parentId, visitorsMongo.IPVisitors[i]);
            }

        return true;

    }

    async run(){

        console.log('running Mongo Importer');

        await mongoose.connect(constants.Mongo_connection_URI, { useMongoClient: true });

        let users = await this.importUsers();
        let siteCategories = await this.importSiteCategories();
        let forums = await this.importForums();
        let topics = await this.importTopics();
        let replies =  await this.importReplies();

        console.log('running Mongo Importer...');

        // console.log('StatisticsHelper', await StatisticsHelper.getTotalVoteUpsCounter('1_forum_14996118214302005'));
        // console.log('StatisticsHelper', await StatisticsHelper.getTotalRepliesCounter('1_forum_14996118408799753'));

        return({
            users: users,
            siteCategories: siteCategories,
            forums: forums,
            topics: topics,
            replies: replies,
            status: 'MERGE',
        });

    }
}

module.exports = new MongoImporter();