/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

import StatisticsHelper from 'REST/statistics/helpers/Statistics.helper.js';


class StatisticsController {

    /*
     REST API
     */

    pageViewNewVisitor(req, res){

        let parentId = '', ip = '';

        if (typeof req.headers !== 'undefined') //it is a http request
            ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
        else
        if (typeof res.handshake  !== 'undefined') { //using old handshake version (outdated)
            // let address = res.handshake.address;
            // ip = address.address||'';
        }
        else
        if (typeof res.request !== 'undefined'){ // it is a socket

            ip = res.request.connection.remoteAddress;

        }

        if (req.hasOwnProperty('body')){
            parentId = req.body.parent || '';
        }

        let answer = StatisticsHelper.addUniqueVisitorCounter(parentId, ip);

        return {result: true, answer: answer};

    }


}

export default new StatisticsController()