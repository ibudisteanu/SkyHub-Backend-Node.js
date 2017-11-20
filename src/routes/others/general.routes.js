
import FunctionsCtrl from 'REST/common/functions/functions.controller.js';

/*
            SOCKET ROUTES
 */


let routesHTTP = {

};

let routesSocket = {

};


/*
            COMMON ROUTES
 */

let routesCommon = {

    /* GET home page. */

    '/': async (req, res, callback) => {

        callback({title: 'SkyHub 2 REST - Backend'}, '', 'index')
    },

    '/version': async (req, res, callback) => {

        callback(FunctionsCtrl.getVersion(req, res));
    },

};




module.exports.routesCommon = routesCommon;
module.exports.routesHTTP = routesHTTP;
module.exports.routesSocket = routesSocket;