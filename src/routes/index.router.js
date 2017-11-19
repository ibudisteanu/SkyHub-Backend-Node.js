/*
	ROUTING
*/

const generalRouter = require('./others/general.router.js');
import RESTRouter from './../application/modules/REST/routes/REST.router.js';
import AdminRouter from './../application/modules/Admin/routes/Admin.router.js';
import uploadRouter from './../application/modules/file-uploads/routes/file-uploads.router.js';

/**
 * initialize HTTP server express
 * @param app
 */
function initializeRouterExpress (app) {

    

    const express = require('express');
    const router = express.Router();

    app.use('/', router);

    app.use('/api', RESTRouter);
    app.use('/api/admin', AdminRouter);
    app.use('/upload', uploadRouter);

}

function initializeRouterSocket(socket){

    data.body = data;

}


//not used
function getExpressRoutes (router, routePrefix) {

    if (typeof routePrefix === 'undefined')  routePrefix = 'api';

    let arrResult = [];

    router.stack.forEach(function(r){
        if (r.route && r.route.path){

            let sRoute = routePrefix+r.route.path;

            if (sRoute[1] === '/')sRoute.substring(1);

            arrResult.push(sRoute);
            console.log(sRoute)
            console.log("methods", r.route.methods)
            console.log("methods", r.handle)
            r.handle();

        }
    });

    return arrResult;
};


exports.initializeRouterExpress = initializeRouterExpress;
exports.initializeRouterSocket = initializeRouterSocket;
