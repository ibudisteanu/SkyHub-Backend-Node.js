var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

constants = require ('./bin/constants.js');

redis = require ('./application/modules/DB/redis_nohm');    //REDIS NOHM


var cors = require('cors');
var app = express();

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



/*//CORS ACCEPTANCE BUG https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Credentials", "true");
    // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});*/


/* ROUTING */
var RESTRouter = require('./application/modules/REST/routes/REST.router.ts');
var AdminRouter = require('./application/modules/Admin/routes/Admin.router.ts');
var indexRouter = require('./routes/index.ts');
var usersRouter = require('./routes/users.ts');
var uploadRouter = require('./application/modules/file-uploads/routes/file-uploads.router.ts');

app.use('/', indexRouter);
app.use('/api', RESTRouter);
app.use('/api/admin', AdminRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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


jwt = require('jsonwebtoken');
requestPromise = require('request-promise');
Promise = require('promise');
constants = require ('./bin/constants.js');

require('run-middleware')(app);

module.exports = app;

