/*
	ROUTING
*/

const express = require('express');

import * as routerGeneral from './others/general.router.js';
import * as routerREST from './../application/modules/REST/routes/REST.router.js';
import * as routerAdmin from './../application/modules/Admin/routes/Admin.router.js';
import routerUpload from './../application/modules/file-uploads/routes/file-uploads.router.js';

/**
 * initialize HTTP server express
 * @param app
 */
function initializeRoutersExpress (app) {

    initializeRouterExpress(app, routerGeneral, '/');
    initializeRouterExpress(app, routerREST, '/api');
    initializeRouterExpress(app, routerAdmin, '/api/admin');

    //file uploads
    app.use('/upload', routerUpload);
}

/**
 *
 * @param router
 * @param routerList
 */
function initializeRouterExpressWithList(router, routerList){

    for (let routerItem in routerList){

        let routeName = routerItem;
        let routeFunction = routerList[routerItem];

        if (typeof routeName === "string" && routeName !=='' && typeof routeFunction === "function"){

            if (routeName[0] !== '/') routeName = '/'+routeName;

            console.log(routeName, typeof routeFunction);

            router.get(routeName, (req, res, next) => {

                routeFunction(req, res, (answer, prefix, template)=>{

                    if (typeof prefix === 'undefined') prefix = '';

                    if (typeof template === 'undefined')
                        res.json( answer);
                    else
                        res.render('index', answer);

                })
            });
        }

    }

}

/**
 *
 * @param app
 * @param routerData
 * @param prefix
 */
function initializeRouterExpress (app, routerData, prefix) {

    const router = express.Router();

    if (typeof routerData.routesHTTP !== 'undefined')
        initializeRouterExpressWithList(router, routerData.routesHTTP);

    if (typeof routerData.routesCommon !== 'undefined')
        initializeRouterExpressWithList(router, routerData.routesCommon);

    app.use(prefix, router);

}




function initializeRoutersSocket(socket){

//    data.body = data;

}


//OBSOLETE not used
function getExpressRoutes (router, routePrefix) {

    if (typeof routePrefix === 'undefined')  routePrefix = 'api';

    let arrResult = [];

    router.stack.forEach(function(r){
        if (r.route && r.route.path){

            let sRoute = routePrefix+r.route.path;

            if (sRoute[1] === '/')sRoute.substring(1);

            arrResult.push(sRoute);
            console.log(sRoute)

        }
    });

    return arrResult;
};


exports.initializeRoutersExpress = initializeRoutersExpress;
exports.initializeRoutersSocket = initializeRoutersSocket;
