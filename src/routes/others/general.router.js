
import FunctionsCtrl from './../../application/modules/REST/common/functions/functions.controller.js';

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

    '/zzz': async (req, res, callback) => {

        callback(FunctionsCtrl.getZZZ());
    },

};




module.exports.routesCommon = routesCommon;
module.exports.routesHTTP = routesHTTP;
module.exports.routesSocket = routesSocket;