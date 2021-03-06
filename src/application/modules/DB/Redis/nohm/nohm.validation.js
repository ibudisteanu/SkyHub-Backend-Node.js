/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/26/2017.
 * (C) BIT TECHNOLOGIES
 */

let CommonFunctions = require('./../../../REST/common/helpers/CommonFunctions.helper.js').default;


//not working
//import UsersHelper from 'REST/users/auth/helpers/Users.helper.js'
//import URLHash  from 'REST/common/URLs/helpers/URLHash.hashlist.js'

exports.validateKeywords = function(value, options, callback) {

    console.log("FOUND KEYWORDS", value);

    let arrKeywords = CommonFunctions.convertKeywordsToArray(value);

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

    //console.log("VALIDATE UNIQUE URL", options, this.p(''));

    this.p('URL','NEW-URL');

    console.log("VALIDATE UNIQUE URL", this.p('URL'),this.id, this);

    let URLHash  = require ('REST/common/URLs/helpers/URLHash.hashlist.js').default;

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

    console.log("VALIDATE Existing AuthorId", value);

    if (value.length < 5) {
        callback(false);
        return;
    }

    let UsersHelper  = require ('REST/users/auth/helpers/Users.helper.js').default
    console.log("UsersHelper", UsersHelper)

    UsersHelper.findUserById(value).then( (answer)=>{

        if (answer !== null)
            callback(true);
        else
            callback(false);

    });

};

