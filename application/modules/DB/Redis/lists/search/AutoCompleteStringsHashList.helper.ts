/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */

var HashList = require ('../HashList.helper.js');
var MaterializedParents = require ('./../../../common/materialized-parents/MaterializedParents.helper.ts');

var hat = require('hat');

class AutoCompleteStringsHashList {

    //sortedList
    constructor(){
        this.hashList = new HashList("AutoCompleteStrings");
    }

    async addAutoCompleteString(phrase, parent){

        let type = MaterializedParents.extractObjectTypeFromId(parent);

        await this.hashList.setHash(type, parent, phrase);

        return type+':'+parent;
    }

    async getAutoCompleteString(autoCompleteIndex){

        var iDelimitator = autoCompleteIndex.indexOf(":");

        var parent = autoCompleteIndex.substring(0, iDelimitator);
        var key = autoCompleteIndex.substring(iDelimitator+ 1);

        return {
            parent: parent,
            id: key,
            text: await this.hashList.getHash(parent, key)
        };

    }

    async getAutoComplete(autoCompleteArray){

        let arrResult = [];

        for (let i=0; i<autoCompleteArray.length; i++)
            arrResult.push(await this.getAutoCompleteString(autoCompleteArray[i]));

        return arrResult;
    }

};

module.exports = new AutoCompleteStringsHashList();