/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var StatisticsHelper = require('./helpers/Statistics.helper.ts');


module.exports = {

    /*
     REST API
     */

    pageViewNewVisitor(req, res){

        let parentId = '', visitorIP = '';

        let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;

        if (req.hasOwnProperty('body')){
            parentId = req.body.parent || '';
        }

        let answer = StatisticsHelper.addUniqueVisitorCounter(parentId, ip);

        return {result: true, answer: answer};

    }


};