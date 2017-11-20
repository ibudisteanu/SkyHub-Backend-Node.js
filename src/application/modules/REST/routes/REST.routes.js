let AuthenticateCtrl = require ('../users/auth/Authenticate.controller.js');
let UsersCtrl = require ('../users/Users.controller.js');
let FunctionsCtrl = require ('../common/functions/functions.controller.js');

let ForumsCtrl = require ('../forums/forums/Forums.controller.js');
let TopicsCtrl = require ('../forums/topics/Topics.controller.js');
let RepliesCtrl = require ('../forums/replies/Replies.controller.js');
let VotingCtrl = require ('../voting/Voting.controller.js');
let NotificationsCtrl = require ('../notifications/notifications/Notifications.controller.js');
let MongoImporter = require ('DB/mongo-importer/MongoImporter.js');

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

    "test/TopContent": async (req, res, callback)  => {
        let TopContentHelper = require ('DB/Redis/lists/sorted-lists/TopObjectsList.helper.js');
        callback( {message: TopContentHelper.test() });
    },

    "test/MaterializedParents": async  (req, res, callback) =>{
        let MaterializedParentsHelper = require ('DB/common/materialized-parents/MaterializedParents.helper.js');
        callback( {message: MaterializedParentsHelper.test() });
    },

    "test/URLHash": async (req, res, callback)  => {
        let URLHashHelper = require ('../common/URLs/helpers/URLHash.hashlist.js');
        callback( {message: URLHashHelper.test() });
    },

    "test/Session": async (req, res, callback)  => {
        let SessionHash = require ('../users/auth/sessions/helpers/SessionHash.helper.js');
        callback( {message: SessionHash.test() });
    },

    "test/SearchList": async (req, res, callback) => {
        let SearchList = require ('DB/Redis/lists/search/SearchList.helper.js');

        SearchList = new SearchList();
        callback( {message: SearchList.test() });
    },

    "test/search/Build-Search-List": async (req, res, callback) => {
        let SearchesHelper = require ('../searches/helpers/Searches.helper.js');
        callback( {message: SearchesHelper.buildSearchTables() });
    },

    "test/meta-extractor": async (req, res, callback) => {
        let MetaExtractorHelper = require ('../../utils/meta-extractor/helpers/MetaExtractor.helper.js');
        callback( {message: MetaExtractorHelper.test() });
    },

    "test/voting": async (req, res, callback) => {
        let VotingsHashList = require ('../voting/helpers/Votings.hashlist.js');
        callback( {message: VotingsHashList.test() });
    },

    "test/notifications": async (req, res, callback) => {
        let NotificationsHelper = require ('../notifications/notifications/helpers/Notifications.helper.js');
        callback( {message: NotificationsHelper.test() });
    },

    'test/mongo-importer': async (req, res, callback) => {
        callback( {message: await MongoImporter.run() });
    },
};

/*
            SOCKET ROUTES
 */

let routesSocket = {

};


/*
            COMMON ROUTES
 */

let routesCommon = {

    "auth/login": async (req, res, callback) => {

        let answer = await AuthenticateCtrl.postAuthenticateLogin(req, res);
        if (answer.result === true)
            console.log("===============AUTH LOGIN ANSWER", answer);

        callback(answer);
    },

    "auth/login-session": async (req, res, callback) => {

        let answer = await AuthenticateCtrl.postAuthenticateSession(req, res);

        if (answer.result === true)
            console.log("===============AUTH SESSION ANSWER", answer);

        callback(answer);
    },

    "auth/register": async (req, res, callback) => {

        callback(await AuthenticateCtrl.postAuthenticateRegister(req, res));
    },

    "auth/register-oauth": async (req, res, callback) => {

        callback(await AuthenticateCtrl.postAuthenticateRegisterOAuth(req, res));
    },

    "auth/logout": async (req, res, callback) => {

        AuthenticateCtrl.logout(req, res);

        callback({"result": true});
    },

    //              USERS
    "users/get-user": async (req, res, callback) => {

        let answer = await UsersCtrl.postGetUser(req, res);
        callback(answer, answer.userId)
    },

    "users/set-profile-pic": async (req, res, callback) => {

        let answer = await UsersCtrl.postSetProfilePic(req, res);
        callback(answer, answer.userId);
    },

    //              ALL PAGES

    "pages/get-all-pages": async (req, res, callback) => {
        callback(await AllPagesCtrl.postGetAllPages(data));
    },

    "version": async (req, res, callback) => {
        callback(FunctionsCtrl.getVersion(req, res));
        console.log("Sending Version...")
    },


    //              FORUMS
    "forums/add-forum": async (req, res, callback) => {

        callback(await ForumsCtrl.postAddForum(req, res));
    },

    "forums/get-forum": async (req, res, callback) => {

        callback(await TopForumsCtrl.postGetForum(req, res));
    },

    "forums/get-top-forums": async (req, res, callback) => {

        callback(await TopForumsCtrl.postGetTopForums(req, res));
    },

    /*
        REPLIES
     */


    "replies/add-reply": async (req, res, callback) => {

        callback(await RepliesCtrl.postAddReply(req, res));
    },

    "replies/get-all-replies": async (req, res, callback) => {

        callback(await TopRepliesCtrl.postGetAllReplies(req, res));
    },

    "replies/get-top-replies": async (req, res, callback) => {

        callback(await TopRepliesCtrl.postGetTopReplies(req, res));
    },

    //              TOPICS

    "topics/add-topic": async (req, res, callback) => {

        callback(await TopicsCtrl.postAddTopic(req, res));
    },


    "content/get-top-content": async (req, res, callback) => {

        callback(await TopContentCtrl.postGetTopContent(req, res));
    },

    "content/get-content": async (req, res, callback) => {

        callback(await TopContentCtrl.postGetContent(req, res));

    },

    //          CONTENT

    "content/set-icon": async (req, res, callback) => {

        callback( await ContentCtrl.postSetIcon(req, res));
    },

    "content/set-cover": async (req, res, callback) => {

        callback(await ContentCtrl.postSetCover(req, res));
    },

    "content/delete-object": async (req, res, callback) => {

        let answer = await ContentCtrl.postDeleteObject(req, res);
        callback(answer, req.id||req.body.id);
    },

    "content/get-URL-slug": async (req, res, callback) => {

        callback(await ContentCtrl.postGetURLSlug(req, res));
    },

    //          SEARCH

    "search/parents": async (req, res, callback) => {

        callback(await SearchesCtrl.searchParents(req, res));
    },

    "meta-extractor/extract-url": async (req, res, callback) => {

        callback(await MetaExtractorCtrl.extractDataFromLink(req, res));
    },

    //          VOTING
    "voting/get-vote": async (req, res, callback) => {

        let answer = await VotingCtrl.postGetVote(req, res);
        callback(answer, answer.vote.parentId)
    },

    "voting/get-all-votes": async (req, res, callback) => {

        let answer = await VotingCtrl.postGetAllVotes(req, res);
        callback(answer, answer.vote.parentId)
    },


    "voting/submit-vote": async (req, res, callback) => {

        let answer = await VotingCtrl.postSubmitVote(req, res);
        callback(answer, answer.vote.parentId)
    },

    //              NOTIFICATIONS

    "notifications/get-notifications": async (req, res, callback) => {


        callback(await NotificationsCtrl.postGetNotifications(req, res));
    },

    "notifications/get-last-notifications": async (req, res, callback) => {

        callback(await NotificationsCtrl.postGetLastNotifications(req, res))
    },

    "notifications/mark-notification-read": async (req, res, callback) => {

        callback(await NotificationsCtrl.postMarkNotificationRead(req, res))
    },

    "notifications/reset-notification-unread-counter": async (req, res, callback) => {


        callback(await NotificationsCtrl.postResetNotificationUnreadCounter(req, res))
    },

    "notifications/mark-notification-shown": async (req, res, callback) => {

        callback(await NotificationsCtrl.postMarkNotificationShown(req, res))
    },


    //          STATISTICS
    "statistics/page-view": async (req, res, callback) => {

        callback(await StatisticsCtrl.pageViewNewVisitor(req, res))
    },

}


module.exports.routesCommon = routesCommon;
module.exports.routesHTTP = routesHTTP;
module.exports.routesSocket = routesSocket;