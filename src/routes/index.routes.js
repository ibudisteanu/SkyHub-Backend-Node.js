/*
	ROUTING
*/

const express = require('express');

import * as routesGeneral from './others/general.routes.js';
import * as routesREST from 'REST/routes/REST.routes.js';
import * as routesAdmin from 'Admin/routes/Admin.router.js';
import routesUpload from 'file-uploads/routes/file-uploads.routes.js';

/**
 * initialize the routes for HTTP server express
 * @param app
 */
function initializeRoutesExpressServer (app) {

    initializeRoutesExpress(app, routesGeneral, '/');
    initializeRoutesExpress(app, routesREST, '/api');
    initializeRoutesExpress(app, routesAdmin, '/api/admin');

    //file uploads
    app.use('/upload', routesUpload);
}

/**
 * initialize the routes for Socket
 * @param socket
 */
function initializeRoutesServerSocket(socket){

    initializeRoutesSocket(socket, routesGeneral, '/');
    initializeRoutesSocket(socket, routesREST, '/api');
    initializeRoutesSocket(socket, routesAdmin, '/api/admin');
//    data.body = data;

}

/**
 *
 * @param router
 * @param routerList
 */
function initializeRoutesExpressWithList(router, routesList){

    for (let routeItem in routesList){

        let routeName = routeItem;
        let routeFunction = routesList[routeItem];

        if (typeof routeName === "string" && routeName !=='' && typeof routeFunction === "function"){

            if (routeName[0] !== '/') routeName = '/'+routeName;

            //console.log(routeName, typeof routeFunction);

            router.get(routeName, async (req, res, next) => {

                await routeFunction(req, res, (answer, suffix, template)=>{

                    //suffix not used

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
function initializeRoutesExpress (app, routerData, prefix) {

    const router = express.Router();

    if (typeof routerData.routesHTTP !== 'undefined')
        initializeRoutesExpressWithList(router, routerData.routesHTTP);

    if (typeof routerData.routesCommon !== 'undefined')
        initializeRoutesExpressWithList(router, routerData.routesCommon);

    app.use(prefix, router);

}


function initializeRoutesSocketWithList(socket, routesList, prefix) {

    prefix = lTrimSlash(prefix);
    prefix = rTrimSlash(prefix);

    for (let routeItem in routesList) {

        let routeName = routeItem;
        let routeFunction = routesList[routeItem];

        if (typeof routeName === "string" && routeName !== '' && typeof routeFunction === "function") {

            let finalRoute = prefix+'/'+lTrimSlash(routeName);

            socket.on(finalRoute, async (data)=>{

                if (typeof data === 'object')
                    data.body = data;

                await routeFunction(data, socket, (answer, suffix, template) => {

                    //template not used

                    if (typeof suffix === 'undefined')
                        socket.emit(finalRoute, answer );
                    else {
                        //console.log('############################ finalRoute',finalRoute+ '/'+lTrimSlash(suffix), answer)
                        socket.emit(finalRoute+ '/'+lTrimSlash(suffix), answer)
                    }

                })

            })

        }

    }
}

function initializeRoutesSocket (socket, routerData, prefix) {

    if (typeof routerData.routesSocket !== 'undefined')
        initializeRoutesSocketWithList(socket, routerData.routesHTTP, prefix);

    if (typeof routerData.routesCommon !== 'undefined')
        initializeRoutesSocketWithList(socket, routerData.routesCommon, prefix);

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

function rTrimSlash(str) {
    if(str[str.length-1] === '/')
        return str.substr(0, str.length - 1);
    return str;
}

function lTrimSlash(str) {
    if(str[0] === '/')
        return str.substr(1);
    return str;
}

exports.initializeRoutesExpressServer = initializeRoutesExpressServer;
exports.initializeRoutesServerSocket = initializeRoutesServerSocket;
