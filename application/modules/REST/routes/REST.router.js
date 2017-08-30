let express = require('express');
let router = express.Router();
let Promise = require('promise');


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

router.get('/auth/login', async function(req, res, next) {
    res.json( await AuthenticateCtrl.postAuthenticateLogin(req, res))
});
router.get('/auth/login-session', async  function(req, res){
    res.json( await AuthenticateCtrl.postAuthenticateSession(req, res))
});
router.get('/auth/register', async  function(req, res, next) {
    res.json( await AuthenticateCtrl.postAuthenticateRegister(req, res))
});
router.get('/auth/register', async  function(req, res, next) {
    res.json( await AuthenticateCtrl.postAuthenticateRegister(req, res))
});
router.get("auth/logout", async  function (req, res){
    AuthenticateCtrl.logout();

    res.json({result:true});
});

//              USERS
router.get('/users/get-user', async  function(req, res, next) {
    res.json( await UsersCtrl.postGetUser(req, res))
});

router.get('/users/set-profile-pic', async  function(req, res, next) {
    res.json( await UsersCtrl.postSetProfilePic(req, res))
});

//              FORUMS

router.get('/forums/add-forum', async  function (req, res, next){
    res.json( await ForumsCtrl.postAddForum(req, res))
});

router.get('/forums/get-top-forums', async  function (req, res, next){
    res.json( await TopForumsCtrl.postGetTopForums(req, res))
});


router.get('/forums/get-forum', async  function (req, res, next){
    res.json( await TopForumsCtrl.postGetForum(req, res))
});

//              TOPICS

router.get('/topics/add-topic', async  function (req, res, next){
    res.json( await TopicsCtrl.postAddTopic(req, res))
});

router.get('/content/get-top-content', async  function (req, res, next){
    res.json( await TopContentCtrl.postGetTopContent(req, res))
});

router.get('/content/get-content', async  function (req, res, next){
    res.json( await TopContentCtrl.postGetContent(req, res))
});



//              REPLIES

router.get('/replies/get-all-replies', async  function (req, res, next){
    res.json( await TopRepliesCtrl.postGetAllReplies(req, res))
});

router.get('/replies/get-top-replies', async  function (req, res, next){
    res.json( await TopRepliesCtrl.postGetTopReplies(req, res))
});

router.get('/replies/get-reply', async  function (req, res, next){
    res.json( await TopRepliesCtrl.postGetForum(req, res))
});

router.get('/replies/add-reply', async  function (req, res, next){
    res.json( await RepliesCtrl.postAddReply(req, res))
});

//              SEARCH/META/SLUGs


router.get('/search/parents', async function (req, res, next){
    res.json( await SearchesCtrl.searchParents(req, res))
});

//          CONTENT
router.get('/content/set-icon', async function (req, res, next){
    res.json( await ContentCtrl.postSetIcon(req, res))
});

router.get('/content/set-cover', async function (req, res, next){
    res.json( await ContentCtrl.postSetCover(req, res))
});

router.get('/content/delete-object', async function (req, res, next){
    res.json( await ContentCtrl.postDeleteObject(req, res))
});

router.get('/content/get-URL-slug', async function (req, res, next){
    res.json( await ContentCtrl.postGetURLSlug(req, res))
});

router.get('/meta-extractor/extract-url', async function (req, res, next){
    res.json( await MetaExtractorCtrl.extractDataFromLink(req, res))
});

//              VOTING

router.get('/voting/get-vote', async function (req, res, next){
    res.json( await VotingCtrl.postGetVote(req, res))
});

router.get('/voting/get-all-votes', async function (req, res, next){
    res.json( await VotingCtrl.postGetAllVotes(req, res))
});

router.get('/voting/submit-vote', async function (req, res, next){
    res.json( await VotingCtrl.postSubmitVote(req, res))
});


//              NOTIFICATIONS

router.get('/notifications/get-notifications', async function (req, res, next){
    res.json( await NotificationsCtrl.postGetNotifications(req, res))
});

router.get('/notifications/get-last-notifications', async  function (req, res, next){
    res.json( await NotificationsCtrl.postGetLastNotifications(req, res))
});

router.get('/notifications/mark-notification-read', async function (req, res, next){
    res.json( await NotificationsCtrl.postMarkNotificationRead(req, res))
});

router.get('/notifications/reset-notification-unread-counter', async  function (req, res, next){
    res.json( await NotificationsCtrl.postResetNotificationUnreadCounter(req, res))
});

router.get('/notifications/mark-notification-shown', async function (req, res, next){
    res.json( await NotificationsCtrl.postMarkNotificationShown(req, res));
});


//              ALL PAGES
router.get('/pages/get-all-pages', async function (req, res, next){
    res.json( await AllPagesCtrl.postGetAllPages(req, res) );
});


router.get('/version', function(req, res, next) {
    res.json( FunctionsCtrl.getVersion(req, res) );
});

router.get('/profile', function (req, res, next){
    res.json( {message: 'Great! You are logged in' });
});

//          STATISTICS
router.get('/statistics/page-view', function (req, res){
    StatisticsCtrl.pageViewNewVisitor(req, res).then ((answer)=> { res.json(answer); });
});


/*
        TESTING
 */

router.get('/test/TopContent', function (req, res, next){
    let TopContentHelper = require ('../../DB/Redis/lists/sorted-lists/TopObjectsList.helper.js');
    res.json( {message: TopContentHelper.test() });
});

router.get('/test/MaterializedParents', function (req, res, next){
    let MaterializedParentsHelper = require ('../../DB/common/materialized-parents/MaterializedParents.helper.js');
    res.json( {message: MaterializedParentsHelper.test() });
});

router.get('/test/URLHash', function (req, res, next){
    let URLHashHelper = require ('../common/URLs/helpers/URLHash.hashlist.js');
    res.json( {message: URLHashHelper.test() });
});

router.get('/test/Session', function (req, res, next){
    let SessionHash = require ('../users/auth/sessions/helpers/SessionHash.helper.js');
    res.json( {message: SessionHash.test() });
});

router.get('/test/SearchList', function (req,res,next){
    let SearchList = require ('../../DB/Redis/lists/search/SearchList.helper.js');

    SearchList = new SearchList();
    res.json( {message: SearchList.test() });
});

router.get('/test/search/Build-Search-List', function (req,res,next){
    let SearchesHelper = require ('../searches/helpers/Searches.helper.js');
    res.json( {message: SearchesHelper.buildSearchTables() });
});

router.get('/test/meta-extractor', function (req,res,next){
    let MetaExtractorHelper = require ('../../utils/meta-extractor/helpers/MetaExtractor.helper.js');
    res.json( {message: MetaExtractorHelper.test() });
});

router.get('/test/voting', function (req,res,next){
    let VotingsHashList = require ('../voting/helpers/Votings.hashlist.js');
    res.json( {message: VotingsHashList.test() });
});

router.get('/test/notifications', function (req,res,next){
    let NotificationsHelper = require ('../notifications/notifications/helpers/Notifications.helper.js');
    res.json( {message: NotificationsHelper.test() });
});

router.get('/test/mongo-importer', async function (req,res,next){
    res.json( {message: await MongoImporter.run() });
});



/*
            FOR SOCKET REST
 */


router.processSocketRoute = function (socket)
{

    socket.on("api/auth/login", async function (data){
        data.body = data;

        let answer = await AuthenticateCtrl.postAuthenticateLogin(data, socket);
        if (answer.result === true)
            console.log("===============AUTH LOGIN ANSWER", answer);

        socket.emit("api/auth/login", answer);
    });

    socket.on("api/auth/login-session", async function (data){
        data.body = data;

        let answer = await AuthenticateCtrl.postAuthenticateSession(data, socket);

        if (answer.result === true)
            console.log("===============AUTH SESSION ANSWER", answer);

        socket.emit("api/auth/login-session", answer);
    });

    socket.on("api/auth/register", async function (data){
        data.body = data;

        socket.emit("api/auth/register", await AuthenticateCtrl.postAuthenticateRegister(data, socket));
    });

    socket.on("api/auth/register-oauth", async function (data){
        data.body = data;

        socket.emit("api/auth/register-oauth", await AuthenticateCtrl.postAuthenticateRegisterOAuth(data, socket));
    });

    socket.on("api/auth/logout", function (data){
        data.body = data;

        AuthenticateCtrl.logout();

        socket.emit("api/logout", {"result":true});
    });

    //              USERS
    socket.on("api/users/get-user", async function (data){
        data.body = data;
        let answer = await UsersCtrl.postGetUser(data, socket);
        socket.emit("api/users/get-user"+'/'+answer.userId, answer)
    });

    socket.on("api/users/set-profile-pic", async function (data) {
        data.body = data;
        let answer  = await UsersCtrl.postSetProfilePic(data, socket);
        socket.emit("api/users/set-profile-pic"+'/'+answer.userId, answer);
    });

    //              ALL PAGES

    socket.on("api/pages/get-all-pages", async function (data){
        data.body = data;
        socket.emit("api/pages/get-all-pages", await AllPagesCtrl.postGetAllPages(data) );
    });

    socket.on("api/version", async function (data){
        socket.emit("api/version",FunctionsCtrl.getVersion(data, socket));
        console.log("Sending Version...")
    });


    //              FORUMS
    socket.on("api/forums/add-forum", async function (data){
        data.body = data;

        let res = await ForumsCtrl.postAddForum(data, socket);
        socket.emit("api/forums/add-forum", res);
    });

    socket.on("api/forums/get-forum", async function (data){
        data.body = data;

        let res = await TopForumsCtrl.postGetForum(data, socket);
        socket.emit("api/forums/get-forum", res);
    });

    socket.on("api/forums/get-top-forums", async function (data){
        data.body = data;

        let res = await TopForumsCtrl.postGetTopForums(data, socket);
        socket.emit("api/forums/get-top-forums", res);
    });



    socket.on("api/replies/add-reply", async function (data){
        data.body = data;

        let res = await RepliesCtrl.postAddReply(data, socket);
        socket.emit("api/replies/add-reply", res);
    });

    socket.on("api/replies/get-all-replies", async function (data){
        data.body = data;

        let res = await TopRepliesCtrl.postGetAllReplies(data, socket);
        socket.emit("api/replies/get-all-replies", res);
    });

    socket.on("api/replies/get-top-replies", async function (data){
        data.body = data;

        let res = await TopRepliesCtrl.postGetTopReplies(data, socket);
        socket.emit("api/replies/get-top-replies", res);
    });

    //              TOPICS

    socket.on("api/topics/add-topic", async function (data){
        data.body = data;

        let res = await TopicsCtrl.postAddTopic(data, socket);
        socket.emit("api/topics/add-topic", res);
    });


    socket.on("api/content/get-top-content", async function (data){
        data.body = data;

        let res = await TopContentCtrl.postGetTopContent(data, socket)
        socket.emit("api/content/get-top-content", res);
    });

    socket.on("api/content/get-content", async function (data){
        data.body = data;

        let res = await TopContentCtrl.postGetContent(data, socket);
        socket.emit("api/content/get-content", res);

    });

    //          CONTENT

    socket.on("api/content/set-icon", async function (data) {
        data.body = data;
        let answer = await ContentCtrl.postSetIcon(data, socket);
        socket.emit("api/content/set-icon", answer);
    });

    socket.on("api/content/set-cover", async function (data) {
        data.body = data;
        let asnwer = await ContentCtrl.postSetCover(data, socket);
        socket.emit("api/content/set-cover", answer);
    });

    socket.on("api/content/delete-object", async function (data) {
        data.body = data;
        let answer = await ContentCtrl.postDeleteObject(data, socket);
        socket.emit("api/content/delete-object"+'/'+data.id, answer);
    });

    socket.on("api/content/get-URL-slug", async function (data) {
        data.body = data;
        let answer = await ContentCtrl.postGetURLSlug(data, socket);
        socket.emit("api/content/get-URL-slug", answer);
    });

    //          SEARCH

    socket.on("api/search/parents", async function (data) {
        data.body = data;
        let answer = await SearchesCtrl.searchParents(data, socket);
        socket.emit("api/search/parents", answer);
    });

    socket.on("api/meta-extractor/extract-url", async function (data) {
        data.body = data;
        let answer = await MetaExtractorCtrl.extractDataFromLink(data, socket);
        socket.emit("api/meta-extractor/extract-url", answer);
    });

    //          VOTING
    socket.on("api/voting/get-vote", async function (data) {
        data.body = data;
        let answer = await VotingCtrl.postGetVote(data, socket);
        socket.emit('api/voting/get-vote'+'/'+answer.vote.parentId, answer )
    });

    socket.on("api/voting/get-all-votes", async function (data) {
        data.body = data;
        let answer = await VotingCtrl.postGetAllVotes(data, socket);
        socket.emit('api/voting/get-all-votes'+'/'+answer.vote.parentId, answer )
    });


    socket.on("api/voting/submit-vote", async function (data) {
        data.body = data;
        let answer = await VotingCtrl.postSubmitVote(data, socket);
        socket.emit('api/voting/submit-vote'+'/'+answer.vote.parentId,answer )
    });

    //              NOTIFICATIONS

    socket.on("api/notifications/get-notifications", async function (data) {
        data.body = data;
        let answer = await NotificationsCtrl.postGetNotifications(data, socket);
        socket.emit('api/notifications/get-notifications',answer );
    });

    socket.on("api/notifications/get-last-notifications", async function (data) {
        data.body = data;
        let answer = await NotificationsCtrl.postGetLastNotifications(data, socket);
        socket.emit('api/notifications/get-last-notifications',answer )
    });

    socket.on("api/notifications/mark-notification-read", async function (data) {
        data.body = data;
        let answer = await NotificationsCtrl.postMarkNotificationRead(data, socket);
        socket.emit('api/notifications/mark-notification',answer )
    });

    socket.on("api/notifications/reset-notification-unread-counter", async function (data) {
        data.body = data;
        let answer = await NotificationsCtrl.postResetNotificationUnreadCounter(data, socket);
        socket.emit('api/notifications/mark-notification-unread-counter',answer )
    });

    socket.on("api/notifications/mark-notification-shown", async function (data) {
        data.body = data;
        let answer = await NotificationsCtrl.postMarkNotificationShown(data, socket);
        socket.emit('api/notifications/mark-shown',answer )
    });


    //          STATISTICS
    socket.on("api/statistics/page-view", async function (data) {
        data.body = data;
        let answer = await StatisticsCtrl.pageViewNewVisitor(data, socket);
        socket.emit('api/api/statistics/page-view',answer )
    });


};




router.getAPIRoutes = function (sRoutePrefix) {

    if (typeof sRoutePrefix === 'undefined')  sRoutePrefix = 'api';

    let arrResult = [];
    router.stack.forEach(function(r){
        if (r.route && r.route.path){

            let sRoute = sRoutePrefix+r.route.path;

            if (sRoute[1] === '/')sRoute.substring(1);

            arrResult.push(sRoute);
            console.log(sRoute)
        }
    });

    return arrResult;
};


// function authenticationMiddleware () {
//     return function (req, res, next) {
//         passport = require ('passport');
//         if (passport.isAuthenticated()) {
//             return next()
//         }
//         return res.json( { error : "You don't have enough privileges"} );
//     }
// }


module.exports = router;