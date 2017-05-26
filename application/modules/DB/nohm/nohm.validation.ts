/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/26/2017.
 * (C) BIT TECHNOLOGIES
 */

var commonFunctions = require ('../../REST/common/helpers/common-functions.helper.ts');

exports.validateKeywords = function(value, options, callback) {

    console.log("FOUND KEYWORDS", value);

    var arrKeywords = commonFunctions.convertKeywordsToArray(value);

    if (arrKeywords.length < 3) {
        callback(false);
    } else {
        console.log("FOUND KEYWORDS", arrKeywords);
        callback(true);
    }
};

exports.validateUsername = function (value, options, callback){
    //if (! /^[^`<>[\]'"\s~!@#%^&*()|\\?,.:{}=+\xA6-\xDF\x00-\x20\x7F\xF0-\xFF]+$/g.test(sUsername)){
    if (! /^(?=.{4,30}$)(?![_.-])(?!.*[_.$-]{2})[a-zA-Z0-9._$-]+$/g.test(value)){
        callback(false)
    } else
        callback(true);
};