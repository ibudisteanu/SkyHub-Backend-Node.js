const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

import {initializeRoutersExpress} from './routes/index.router';
import constants from  './bin/constants.js';

var redis = require ('./application/modules/DB/redis_nohm');    //REDIS NOHM


const cors = require('cors');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors());


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//the first parameter is used for a prefix...
app.use("/",express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));
// in case it doesn't work
 //app.use("/public", express.static(__dirname + '/public'));


//initialzie Routes
initializeRoutersExpress(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/*
    SESSIONS TUTORIAL http://mono.software/2014/08/25/Sharing-sessions-between-SocketIO-and-Express-using-Redis/
 */

// passport = require('passport');
// LocalStrategy = require('passport-local').Strategy;
// session = require('express-session');
// RedisStore = require('connect-redis')(session);
// sessionStore = new RedisStore({ host: constants.SESSION_RedisHost,  port: constants.SESSION_RedisPort,  client: redis.redisClient });
//
// app.use (session({
//     store: sessionStore,
//     secret: constants.SESSION_Secret_key,
//     resave: false,
//     saveUninitialized: false,
// }));

//
// //passportSocketIoRedis = require("passport-socketio-redis");    //Passport Socket io Redis
// passportSocketIoRedis = require('passport.socketio');
//
//
//
// // When configure your session for express use options like this.
// app.use(session({
//     key: 'connect.sid',
//     secret: constants.SESSION_Secret_key, // the session_secret to parse the cookie
//     store: sessionStore, // we NEED to use a sessionstore. no memorystore please
//     resave: true,
//     saveUninitialized: true
//     })
// );
//

 // // Use passport
 // app.use(passport.initialize());
 // app.use(passport.session());

/*
	GLOBAL LIBRARIES
*/

var jwt = require('jsonwebtoken');
var requestPromise = require('request-promise');


require('run-middleware')(app);

module.exports = app;

