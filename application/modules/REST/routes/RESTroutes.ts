var express = require('express');
var router = express.Router();
var Promise = require('promise');


var AuthenticateCtrl = require ('../auth/Authenticate.controller.ts');
var FunctionsCtrl = require ('./../common/functions/functions.controller.ts');

var ForumsCtrl = require ('../forums/forums/Forums.controller.ts');
var TopicsCtrl = require ('../forums/topics/Topics.controller.ts');
var RepliesCtrl = require ('../forums/replies/Replies.controller.ts');
var VotingCtrl = require ('../common/Voting/Voting.controller.ts');

var TopContentCtrl = require ('../forums/content/TopContent.controller.ts');
var TopForumsCtrl = require ('../forums/content/TopForums.controller.ts');
var TopRepliesCtrl = require ('../forums/content/TopReplies.controller.ts');

var ContentCtrl = require ('../forums/content/Content.controller.ts');

var SearchesController = require ('../../REST/searches/Searches.controller.ts');
var MetaExtractorController = require ('../../utils/meta-extractor/MetaExtractor.controller.ts');

router.get('/auth/login', function(req, res, next) {
    AuthenticateCtrl.postAuthenticateLogin(req, res).then ((answer) =>{ res.json(answer); });
});

router.get('/auth/login-session', function(req, res){

    AuthenticateCtrl.postAuthenticateSession(req, res).then ((answer)=>{ res.json(answer); });
});

router.get('/auth/register', function(req, res, next) {
    AuthenticateCtrl.postAuthenticateRegister(req, res).then ( (answer ) => { res.json(answer); });

});

router.get('/auth/register', function(req, res, next) {
    AuthenticateCtrl.postAuthenticateRegister(req, res).then ( (answer ) => { res.json(answer); });
});

router.get("auth/logout", function (req, res){
    AuthenticateCtrl.logout();

    res.json({result:true});
});

//              FORUMS

router.get('/forums/add-forum', function (req, res, next){
    ForumsCtrl.postAddForum(req, res).then ( (answer ) => { res.json( answer ); });
});

router.get('/forums/get-top-forums', function (req, res, next){
    TopForumsCtrl.postGetTopForums(req, res).then ( (answer) => { res.json( answer ); });
});


router.get('/forums/get-forum', function (req, res, next){
    TopForumsCtrl.postGetForum(req, res).then ( (answer) => { res.json( answer ); });
});

//              TOPICS

router.get('/topics/add-topic', function (req, res, next){
    TopicsCtrl.postAddTopic(req, res).then ( (answer ) => { res.json( answer ); });
});

router.get('/content/get-top-content', function (req, res, next){
    TopContentCtrl.postGetTopContent(req, res).then ( (answer ) => { res.json( answer ); });
});

router.get('/content/get-content', function (req, res, next){
    TopContentCtrl.postGetContent(req, res).then ( ( answer ) => { res.json( answer ); });
});



//              REPLIES

router.get('/replies/get-all-replies', function (req, res, next){
    TopRepliesCtrl.postGetAllReplies(req, res).then ( (answer) => { res.json( answer ); });
});

router.get('/replies/get-top-replies', function (req, res, next){
    TopRepliesCtrl.postGetTopReplies(req, res).then ( (answer) => { res.json( answer ); });
});

router.get('/replies/get-reply', function (req, res, next){
    TopRepliesCtrl.postGetForum(req, res).then ( (answer) => { res.json( answer ); });
});

router.get('/replies/add-reply', function (req, res, next){
    RepliesCtrl.postAddReply(req, res).then ( (answer ) => { res.json( answer ); });
});

//              SEARCH/META/SLUGs


router.get('/search/parents', function (req, res, next){
    SearchesController.searchParents(req, res).then ( ( answer ) => { res.json( answer ); });
});

router.get('/content/get-URL-slug', function (req, res, next){
    ContentCtrl.postGetURLSlug(req, res).then ( ( answer ) => { res.json( answer ); });
});

router.get('/meta-extractor/extract-url', function (req, res, next){
    MetaExtractorController.extractDataFromLink(req, res).then ( ( answer ) => { res.json( answer ); });
});

//              VOTING

router.get('/voting/get-vote', function (req, res, next){
    VotingCtrl.postGetVote(req, res).then ( ( answer ) => { res.json( answer ); });
});

router.get('/voting/get-all-votes', function (req, res, next){
    VotingCtrl.postGetAllVotes(req, res).then ( ( answer ) => { res.json( answer ); });
});

router.get('/voting/submit-vote', function (req, res, next){
    VotingCtrl.postSubmitVote(req, res).then ( ( answer ) => { res.json( answer ); });
});



router.get('/version', function(req, res, next) {
    res.json( FunctionsCtrl.getVersion(req, res) );
});

router.get('/profile', function (req, res, next){
    res.json( {message: 'Great! You are logged in' });
});

router.get('/test/TopContent', function (req, res, next){
    var TopContentHelper = require ('../../DB/Redis/lists/sorted-lists/TopObjectsList.helper.ts');
    res.json( {message: TopContentHelper.test() });
});

router.get('/test/MaterializedParents', function (req, res, next){
    var MaterializedParentsHelper = require ('../../DB/common/materialized-parents/MaterializedParents.helper.ts');
    res.json( {message: MaterializedParentsHelper.test() });
});

router.get('/test/URLHash', function (req, res, next){
    var URLHashHelper = require ('../common/URLs/helpers/URLHash.helper.ts');
    res.json( {message: URLHashHelper.test() });
});

router.get('/test/Session', function (req, res, next){
    var SessionHash = require ('../../REST/auth/sessions/helpers/SessionHash.helper.ts');
    res.json( {message: SessionHash.test() });
});

router.get('/test/SearchList', function (req,res,next){
    var SearchList = require ('../../DB/Redis/lists/search/SearchList.helper.ts');

    SearchList = new SearchList();
    res.json( {message: SearchList.test() });
});

router.get('/test/search/Build-Search-List', function (req,res,next){

    let SearchesHelper = require ('./../../REST/searches/helpers/Searches.helper.ts');
    res.json( {message: SearchesHelper.buildSearchTables() });
});

router.get('/test/meta-extractor', function (req,res,next){

    let MetaExtractorHelper = require ('./../../utils/meta-extractor/helpers/MetaExtractor.helper.ts');
    res.json( {message: MetaExtractorHelper.test() });
});

router.get('/test/voting', function (req,res,next){

    let VotingHelperHelper = require ('./../../REST/common/Voting/helpers/Voting.helper.ts');
    res.json( {message: VotingHelperHelper.test() });
});



/*
            FOR SOCKET REST
 */


router.processSocketRoute = function (socket)
{

    socket.on("api/auth/login", function (data){
        data.body = data;

        AuthenticateCtrl.postAuthenticateLogin(data, socket).then ( (answer ) => {

            if (answer.result == true)
                console.log("===============AUTH LOGIN ANSWER", answer);

            socket.emit("api/auth/login", answer);
        });
    });

    socket.on("api/auth/login-session", function (data){
        data.body = data;

        AuthenticateCtrl.postAuthenticateSession(data, socket).then ((answer)=>{

            if (answer.result == true)
                console.log("===============AUTH SESSION ANSWER", answer);

            socket.emit("api/auth/login-session", answer);

        });
    });

    socket.on("api/auth/register", function (data){
        data.body = data;

        AuthenticateCtrl.postAuthenticateRegister(data, socket).then ( (answer ) => {
            socket.emit("api/auth/register", answer);
        });

    });

    socket.on("api/auth/register-oauth", function (data){
        data.body = data;

        AuthenticateCtrl.postAuthenticateRegisterOAuth(data, socket).then ( ( answer ) => {
            socket.emit("api/auth/register-oauth", answer);
        });

    });

    socket.on("api/auth/logout", function (data){
        data.body = data;

        AuthenticateCtrl.logout();

        console.log("===================LOGOUT");
        socket.emit("api/logout", {"result":true});

    });


    socket.on("api/version", function (data){
        socket.emit("api/version",FunctionsCtrl.getVersion(data, socket));
        console.log("Sending Version...")
    });


    socket.on("api/forums/add-forum", function (data){
        data.body = data;

        ForumsCtrl.postAddForum(data, socket).then ( (res ) => {
            socket.emit("api/forums/add-forum", res);
        });
    });

    socket.on("api/forums/get-forum", function (data){
        data.body = data;

        TopForumsCtrl.postGetForum(data, socket).then ( (res ) => {
            socket.emit("api/forums/get-forum", res);
        });

    });

    socket.on("api/forums/get-top-forums", function (data){
        data.body = data;

        TopForumsCtrl.postGetTopForums(data, socket).then ( (res ) => {
            socket.emit("api/forums/get-top-forums", res);
        });
    });



    socket.on("api/replies/add-reply", function (data){
        data.body = data;

        RepliesCtrl.postAddReply(data, socket).then ( (res ) => {
            socket.emit("api/replies/add-reply", res);
        });
    });

    socket.on("api/replies/get-all-replies", function (data){
        data.body = data;

        TopRepliesCtrl.postGetAllReplies(data, socket).then ( (res ) => {
            socket.emit("api/replies/get-all-replies", res);
        });
    });

    socket.on("api/replies/get-top-replies", function (data){
        data.body = data;

        TopRepliesCtrl.postGetTopReplies(data, socket).then ( (res ) => {
            socket.emit("api/replies/get-top-replies", res);
        });
    });

    //              TOPICS

    socket.on("api/topics/add-topic", function (data){
        data.body = data;

        TopicsCtrl.postAddTopic(data, socket).then ( (res ) => {
            socket.emit("api/topics/add-topic", res);
        });
    });


    socket.on("api/content/get-top-content", function (data){
        data.body = data;

        TopContentCtrl.postGetTopContent(data, socket).then ( (res ) => {
            socket.emit("api/content/get-top-content", res);
        });
    });

    socket.on("api/content/get-content", function (data){
        data.body = data;

        TopContentCtrl.postGetContent(data, socket).then ( (res ) => {
            socket.emit("api/content/get-content", res);
        });

    });

    socket.on("api/content/get-URL-slug", function (data) {
        data.body = data;
        ContentCtrl.postGetURLSlug(data, socket).then ( ( answer ) => {
            socket.emit("api/content/get-URL-slug", answer);
        });
    });

    //          SEARCH

    socket.on("api/search/parents", function (data) {
        data.body = data;
        SearchesController.searchParents(data, socket).then ( ( answer ) => {
            socket.emit("api/search/parents", answer);
        });
    });

    socket.on("api/meta-extractor/extract-url", function (data) {
        data.body = data;
        MetaExtractorController.extractDataFromLink(data, socket).then ( ( answer ) => {
            socket.emit("api/meta-extractor/extract-url", answer);
        });
    });

    //          VOTING
    socket.on("api/voting/get-vote", function (data) {
        data.body = data;
        VotingCtrl.postGetVote(data, socket).then ( ( answer ) => { socket.emit('api/voting/get-vote'+'/'+answer.vote.parentId, answer )});
    });

    socket.on("api/voting/get-all-votes", function (data) {
        data.body = data;
        VotingCtrl.postGetAllVotes(data, socket).then ( ( answer ) => { socket.emit('api/voting/get-all-votes'+'/'+answer.vote.parentId, answer )});
    });


    socket.on("api/voting/submit-vote", function (data) {
        data.body = data;
        VotingCtrl.postSubmitVote(data, socket).then ( ( answer ) => { socket.emit('api/voting/submit-vote'+'/'+answer.vote.parentId,answer ) });
    });


};




router.getAPIRoutes = function (sRoutePrefix) {

    if (typeof sRoutePrefix === 'undefined')  sRoutePrefix = 'api';

    var arrResult = [];
    router.stack.forEach(function(r){
        if (r.route && r.route.path){

            var sRoute = sRoutePrefix+r.route.path;

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