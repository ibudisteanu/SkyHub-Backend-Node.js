/*
	ROUTING
*/

const express = require('express');

import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

import routesGeneral from './others/general.routes.js';
import routesREST from 'REST/routes/REST.routes.js';
import routesAdmin from 'Admin/routes/Admin.router.js';
import routesUpload from 'file-uploads/routes/file-uploads.routes.js';

/**
 * initialize the routes for HTTP server express
 * @param app
 */
function initializeRoutesExpressServer (app) {

    _initializeRoutesExpress(app, routesGeneral, '/');
    _initializeRoutesExpress(app, routesREST, '/api');
    _initializeRoutesExpress(app, routesAdmin, '/api/admin');

    //file uploads
    app.use('/upload', routesUpload);
}

/**
 * initialize the routes for Socket
 * @param socket
 */
function initializeRoutesServerSocket(socket){

    _initializeRoutesExpress(socket, routesGeneral, '/');
    _initializeRoutesExpress(socket, routesREST, '/api');
    _initializeRoutesExpress(socket, routesAdmin, '/api/admin');
//    data.body = data;

}

/**
 *
 * @param router
 * @param routerList
 */
async function _initializeRoutesExpressWithList(router, routesList){

    for (let routeItem in routesList){

        let routeName = routeItem;
        let routeFunction = routesList[routeItem];

        if (typeof routeName === "string" && routeName !=='' && typeof routeFunction === "function"){

            if (routeName[0] !== '/') routeName = '/'+routeName;

            //console.log(routeName, typeof routeFunction);

            router.get(routeName, async (req, res, next) => {

                req.userAuthenticated = await AuthenticatingUser.loginUser(req);

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
function _initializeRoutesExpress (app, routerData, prefix) {

    const router = express.Router();

    if (typeof routerData.routesHTTP !== 'undefined')
        _initializeRoutesExpressWithList(router, routerData.routesHTTP);

    if (typeof routerData.routesCommon !== 'undefined')
        _initializeRoutesExpressWithList(router, routerData.routesCommon);

    app.use(prefix, router);

}


function _initializeRoutesExpressWithList(socket, routesList, prefix) {

    prefix = _lTrimSlash(prefix);
    prefix = _rTrimSlash(prefix);

    for (let routeItem in routesList) {

        let routeName = routeItem;
        let routeFunction = routesList[routeItem];

        if (typeof routeName === "string" && routeName !== '' && typeof routeFunction === "function") {

            let finalRoute = prefix+'/'+_lTrimSlash(routeName);

            socket.on(finalRoute, async (data)=>{

                if (data === '') data = {};

                data.userAuthenticated = await AuthenticatingUser.loginUser(data);
                data.body = data;

                await routeFunction(data, socket, (answer, suffix, template) => {

                    //template not used

                    if (typeof suffix === 'undefined')
                        socket.emit(finalRoute, answer );
                    else {
                        //console.log('############################ finalRoute',finalRoute+ '/'+_lTrimSlash(suffix), answer)
                        socket.emit(finalRoute+ '/'+_lTrimSlash(suffix), answer)
                    }

                })

            })

        }

    }
}

function _initializeRoutesExpress (socket, routerData, prefix) {

    if (typeof routerData.routesSocket !== 'undefined')
        _initializeRoutesExpressWithList(socket, routerData.routesHTTP, prefix);

    if (typeof routerData.routesCommon !== 'undefined')
        _initializeRoutesExpressWithList(socket, routerData.routesCommon, prefix);

}




function _rTrimSlash(str) {
    if(str[str.length-1] === '/')
        return str.substr(0, str.length - 1);
    return str;
}

function _lTrimSlash(str) {
    if(str[0] === '/')
        return str.substr(1);
    return str;
}

export {
    initializeRoutesExpressServer,
    initializeRoutesServerSocket
}
