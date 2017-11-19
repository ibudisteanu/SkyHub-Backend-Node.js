let AuthenticateCtrl = require ('../users/auth/Authenticate.controller.js');
let UsersCtrl = require ('../users/Users.controller.js');
let FunctionsCtrl = require ('../common/functions/functions.controller.js');

let ForumsCtrl = require ('../forums/forums/Forums.controller.js');
let TopicsCtrl = require ('../forums/topics/Topics.controller.js');
let RepliesCtrl = require ('../forums/replies/Replies.controller.js');
let VotingCtrl = require ('../voting/Voting.controller.js');
let NotificationsCtrl = require ('../notifications/notifications/Notifications.controller.js');
let MongoImporter = require ('../../DB/mongo-importer/MongoImporter.js');

let TopContentCtrl = require ('../forums/top-content/TopContent.controller.js');
let TopForumsCtrl = require ('../forums/top-content/TopForums.controller.js');
let TopRepliesCtrl = require ('../forums/top-content/TopReplies.controller.js');

let ContentCtrl = require ('../forums/content/Content.controller.js');
let StatisticsCtrl = require ('../statistics/Statistics.controller.js');

let SearchesCtrl = require ('../searches/Searches.controller.js');
let MetaExtractorCtrl = require ('../../utils/meta-extractor/MetaExtractor.controller.js');
let AllPagesCtrl = require ('../forums/content/all-pages/AllPages.controller.js');


/*
    TESTING

    HTTP routes
 */

let routesHTTP = {

    "/test/TopContent": async (req, res, callback)  => {
        let TopContentHelper = require ('../../DB/Redis/lists/sorted-lists/TopObjectsList.helper.js');
        callback( {message: TopContentHelper.test() });
    },

    "/test/MaterializedParents": async  (req, res, callback) =>{
        let MaterializedParentsHelper = require ('../../DB/common/materialized-parents/MaterializedParents.helper.js');
        callback( {message: MaterializedParentsHelper.test() });
    },

    "/test/URLHash": async (req, res, callback)  => {
        let URLHashHelper = require ('../common/URLs/helpers/URLHash.hashlist.js');
        callback( {message: URLHashHelper.test() });
    },

    "/test/Session": async (req, res, callback)  => {
        let SessionHash = require ('../users/auth/sessions/helpers/SessionHash.helper.js');
        callback( {message: SessionHash.test() });
    },

    "/test/SearchList": async (req, res, callback) => {
        let SearchList = require ('../../DB/Redis/lists/search/SearchList.helper.js');

        SearchList = new SearchList();
        callback( {message: SearchList.test() });
    },

    "/test/search/Build-Search-List": async (req, res, callback) => {
        let SearchesHelper = require ('../searches/helpers/Searches.helper.js');
        callback( {message: SearchesHelper.buildSearchTables() });
    },

    "/test/meta-extractor": async (req, res, callback) => {
        let MetaExtractorHelper = require ('../../utils/meta-extractor/helpers/MetaExtractor.helper.js');
        callback( {message: MetaExtractorHelper.test() });
    },

    "/test/voting": async (req, res, callback) => {
        let VotingsHashList = require ('../voting/helpers/Votings.hashlist.js');
        callback( {message: VotingsHashList.test() });
    },

    "/test/notifications": async (req, res, callback) => {
        let NotificationsHelper = require ('../notifications/notifications/helpers/Notifications.helper.js');
        callback( {message: NotificationsHelper.test() });
    },

    '/test/mongo-importer': async (req, res, callback) => {
        callback( {message: await MongoImporter.run() });
    },
};





/*
            FOR SOCKET REST
 */



let routesCommon = {

    "api/auth/login" : async (req, res, callback) =>{

        let answer = await AuthenticateCtrl.postAuthenticateLogin(req, res);
        if (answer.result === true)
            console.log("===============AUTH LOGIN ANSWER", answer);

        callback(answer);
    },

    "api/auth/login-session" : async (req, res, callback) => {

        let answer = await AuthenticateCtrl.postAuthenticateSession(req, res);

        if (answer.result === true)
            console.log("===============AUTH SESSION ANSWER", answer);

        callback(answer);
    },

    "api/auth/register": async (req, res, callback) => {

        callback( await AuthenticateCtrl.postAuthenticateRegister(req, res) );
    },

    "api/auth/register-oauth": async (req, res, callback) => {

        callback ( await AuthenticateCtrl.postAuthenticateRegisterOAuth(req, res) );
    },

    "api/auth/logout": async (req, res, callback) => {

        AuthenticateCtrl.logout(req, res);

        callback({"result":true});
    },

    //              USERS
    "api/users/get-user": async (req, res, callback) => {

        let answer = await UsersCtrl.postGetUser(req, res);
        callback( answer, answer.userId)
    },

    "api/users/set-profile-pic": async (req, res, callback)  => {

        let answer  = await UsersCtrl.postSetProfilePic(req, res);
        callback(answer, answer.userId);
    },

    //              ALL PAGES

    "api/pages/get-all-pages": async (req, res, callback) => {
        callback(await AllPagesCtrl.postGetAllPages(data) );
    },

    "api/version": async (req, res, callback) => {
        callback( FunctionsCtrl.getVersion(req, res) );
        console.log("Sending Version...")
    },


    //              FORUMS
    "api/forums/add-forum": async (req, res, callback) => {

        callback(await ForumsCtrl.postAddForum(req, res));
    },

    "api/forums/get-forum": async (req, res, callback) => {

        callback(await TopForumsCtrl.postGetForum(req, res));
    },

    "api/forums/get-top-forums": async (req, res, callback) => {

        callback(await TopForumsCtrl.postGetTopForums(req, res));
    },

    /*
        REPLIES
     */


    "api/replies/add-reply": async (req, res, callback) => {

        callback(await RepliesCtrl.postAddReply(req, res));
    },

    "api/replies/get-all-replies": async (req, res, callback) => {

        callback( await TopRepliesCtrl.postGetAllReplies(req, res) );
    },

    "api/replies/get-top-replies": async (req, res, callback) => {

        callback(await TopRepliesCtrl.postGetTopReplies(req, res));
    },

    //              TOPICS

    "api/topics/add-topic": async (req, res, callback) => {

        callback("api/topics/add-topic", await TopicsCtrl.postAddTopic(req, res));
    },


    "api/content/get-top-content": async (req, res, callback) => {

        callback (await TopContentCtrl.postGetTopContent(req, res));
    },

    "api/content/get-content": async (req, res, callback) => {

        callback(await TopContentCtrl.postGetContent(req, res));

    },

    //          CONTENT

    "api/content/set-icon": async (req, res, callback) => {

        callback("api/content/set-icon", await ContentCtrl.postSetIcon(req, res));
    },

    "api/content/set-cover": async (req, res, callback) => {

        callback("api/content/set-cover", await ContentCtrl.postSetCover(req, res));
    },

    "api/content/delete-object": async (req, res, callback) => {

        let answer = await ContentCtrl.postDeleteObject(req, res);
        callback( answer, data.id);
    },

    "api/content/get-URL-slug": async (req, res, callback) => {

        callback(await ContentCtrl.postGetURLSlug(req, res));
    },

    //          SEARCH

    "api/search/parents": async (req, res, callback) => {

        callback(await SearchesCtrl.searchParents(req, res));
    },

    "api/meta-extractor/extract-url": async (data)  => {

        callback(await MetaExtractorCtrl.extractDataFromLink(req, res));
    },

    //          VOTING
    "api/voting/get-vote": async (req, res, callback) => {

        let answer = await VotingCtrl.postGetVote(req, res);
        callback(answer , answer.vote.parentId)
    },

    "api/voting/get-all-votes": async (req, res, callback) => {

        let answer = await VotingCtrl.postGetAllVotes(req, res);
        callback(answer , answer.vote.parentId)
    },


    "api/voting/submit-vote": async (req, res, callback) => {

        let answer = await VotingCtrl.postSubmitVote(req, res);
        callback(answer , answer.vote.parentId)
    },

    //              NOTIFICATIONS

    "api/notifications/get-notifications": async (req, res, callback) => {


        callback(await NotificationsCtrl.postGetNotifications(req, res));
    },

    "api/notifications/get-last-notifications": async (req, res, callback) => {

        callback(await NotificationsCtrl.postGetLastNotifications(req, res) )
    },

    "api/notifications/mark-notification-read": async (req, res, callback) => {

        callback(await NotificationsCtrl.postMarkNotificationRead(req, res))
    },

    "api/notifications/reset-notification-unread-counter": async (req, res, callback) => {


        callback(await NotificationsCtrl.postResetNotificationUnreadCounter(req, res))
    },

    "api/notifications/mark-notification-shown": async (req, res, callback) => {

        callback(await NotificationsCtrl.postMarkNotificationShown(req, res))
    },


    //          STATISTICS
    "api/statistics/page-view": async (req, res, callback) => {

        callback(await StatisticsCtrl.pageViewNewVisitor(req, res) )
    },

]


module.routesCommon = routesCommon;
module.routesHTTP = routesHTTP;