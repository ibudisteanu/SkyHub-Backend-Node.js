/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/26/2017.
 * (C) BIT TECHNOLOGIES
 */

import CommonFunctions from 'REST/common/helpers/CommonFunctions.helper.js'

exports.validateKeywords = function(value, options, callback) {

    console.log("FOUND KEYWORDS", value);

    var arrKeywords = CommonFunctions.convertKeywordsToArray(value);

    if (arrKeywords.length < 3) {
        callback(false);
    } else {
        console.log("FOUND KEYWORDS", arrKeywords);
        callback(true);
    }
};

exports.sanitizeUsername = function (value, character){
    if (typeof character === 'undefined') character = '_';

    return value.replace(/([^a-zA-Z0-9._$-]+)/gi, character);
};

exports.validateUsername = function (value, options, callback){
    //if (! /^[^`<>[\]'"\s~!@#%^&*()|\\?,.:{}=+\xA6-\xDF\x00-\x20\x7F\xF0-\xFF]+$/g.test(sUsername)){
    if (! /^(?=.{4,30}$)(?![_.-])(?!.*[_.$-]{2})[a-zA-Z0-9._$-]+$/g.test(value)){

        if (callback !== null)  callback(false);
        else return false;
    } else {
        if (callback !== null)  callback(true);
        else return true;
    }
};

exports.validateUniqueURL = function (value, options, callback){

    var URLHash = require ('REST/common/URLs/helpers/URLHash.hashlist.js');

    //console.log("VALIDATE UNIQUE URL", options, this.p(''));

    this.p('URL','NEW-URL');

    console.log("VALIDATE UNIQUE URL", this.p('URL'),this.id, this);

    URLHash.replaceOldURL(this.p('URL'),value).then( (answer)=>{

        if (answer === null)
            callback(true);
        else
            callback(false);

    });

};

/*
        VALIDATE THE EXISTANCE OF THE AUTHOR ID
 */
exports.validateExistingAuthorId = function (value, options, callback){

    var UsersHelper = require ('REST/users/auth/helpers/Users.helper.js');

    console.log("VALIDATE Existing AuthorId", value);

    if (value.length < 5) {
        callback(false);
        return;
    }

    UsersHelper.findUserById(value).then( (answer)=>{

        if (answer !== null)
            callback(true);
        else
            callback(false);

    });

};

