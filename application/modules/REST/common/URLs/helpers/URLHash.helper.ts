/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/5/2017.
 * (C) BIT TECHNOLOGIES
 */

var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');

class URLHash {

    //sortedList
    constructor(){
        this.hashList = new HashList("URL");
    }

    async addNewURL(sURL, object){

        if (object.constructor === "object") object = object.id;

        let sFinalNewURL = sURL;

        let existingHashResult = await this.hashList.getHash('',sFinalNewURL);

        let iTrialsLeft = 1000;

        while ((existingHashResult !== null)&&(iTrialsLeft > 0)){

            sFinalNewURL = sURL+'-'+Math.floor((Math.random() * 10000) + 1);
            existingHashResult = await this.hashList.getHash('',sFinalNewURL);

            iTrialsLeft--;
        }

        return await this.hashList.setHash('', sFinalNewURL, object);
    }

    async replaceOldURL(sOldURL, sNewURL, object, bDeleteAllHashes){

        var commonFunctions = require ('../../helpers/common-functions.helper.ts');
        sNewURL = commonFunctions.url_slug(sNewURL);

        if ( (bDeleteAllHashes || false) === true ){
            await this.hashList.deleteHash('',sOldURL);
            return await this.hashList.deleteHash('',sNewURL);
        }

        if ((sOldURL || '') !== '')
            await this.hashList.deleteHash('',sOldURL);

        return this.addNewURL(sNewURL, object);
    }

    async checkUniqueURL(sURL){
        return await this.hashList.getHash('',sURL);
    }

    async test(){

        this.addNewURL("URL1","1");
        this.addNewURL("URL2","2");
        this.addNewURL("URL3","3");
        this.addNewURL("URL3","3");
        this.addNewURL("URL3","3");
        this.addNewURL("URL3","3");
        this.addNewURL("URL4","4");
        console.log("URL ADD NEW IDENTICALLY ",await this.addNewURL("URL2","3"));

        console.log("URL REPLACE ",await this.replaceOldURL("URL2","URL2_SCHIMBAT","22_schimbat"));
    }

};

module.exports = new URLHash();