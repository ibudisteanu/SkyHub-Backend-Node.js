const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

if ( !process.env.BROWSER ) {
    require('console-warn');
    require('console-info');
    require('console-error');
}

import {initializeRoutesExpressServer} from './routes/index.routes';
import constants from 'bin/constants';

import redis from 'DB/redis_nohm';    //REDIS NOHM


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
app.use("/",express.static(path.join(__dirname, (__dirname.indexOf("/build/dist_bundle")>0 ? '../../' : '')+'public')));
// app.use(express.static(path.join(__dirname, 'public')));
// in case it doesn't work
 //app.use("/public", express.static(__dirname + '/public'));


// initialize Routes for Express App
initializeRoutesExpressServer(app);


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
	GLOBAL LIBRARIES
*/

require('run-middleware')(app);

export default app;

