/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/5/2017.
 * (C) BIT TECHNOLOGIES
 */

var HashList = require ('../../../../DB/Redis/lists/HashList.helper.ts');
var commonFunctions = require ('../../helpers/common-functions.helper.ts');

class URLHash {

    //sortedList
    constructor(){
        this.hashList = new HashList("URL");
    }

    async getId(sURL){

        return this.hashList.getHash('',sURL);

    }
    /*
         URL:   "forum, topic foarte cool :)) " => forum/topic-misto

         forum is parentURL, "topic foarte misto" is sInitialURL
     */
    async getFinalNewURL(sParentURL, sInitialURL, object, sSpecialCharSeparator){

        if (typeof sInitialURL !== "string") return null;

        object = object || null;
        if ((object!==null)&&(object.constructor === "object")) object = object.id;

        if (sParentURL !== '')
            sParentURL = commonFunctions.url_slug(sParentURL);

        sInitialURL = (sParentURL !== '' ? sParentURL + '/' : '') + (typeof sSpecialCharSeparator === 'string' ? sSpecialCharSeparator : '') + commonFunctions.url_slug(sInitialURL);

        let sFinalNewURL = sInitialURL;

        console.log("SEARCHING FOR ",sFinalNewURL);

        let existingHashResult = await this.hashList.getHash('',sFinalNewURL.toLowerCase() );

        let iTrialsLeft = 1000;

        while ( (existingHashResult !== object)&&(existingHashResult !== null)&&(iTrialsLeft > 0) ){

            sFinalNewURL = sInitialURL+'-'+Math.floor((Math.random() * 10000) + 1);
            existingHashResult = await this.hashList.getHash('',sFinalNewURL.toLowerCase() );

            console.log("SEARCHING FOR ",sFinalNewURL);

            iTrialsLeft--;
        }

        return sFinalNewURL;

    }

    async addNewURL(sParentURL, sURL, object){

        object = object || '';
        if ((object!==null)&&(object.constructor === "object")) object = object.id;

        let sFinalNewURL = await this.getFinalNewURL(sParentURL, sURL, object);

        return await this.hashList.setHash('', sFinalNewURL, object);
    }

    async replaceOldURL(sOldURL, sNewURL, object, bDeleteAllHashes){

        object = object || '';
        if ((object!==null)&&(object.constructor === "object")) object = object.id;
        sNewURL = commonFunctions.url_slug(sNewURL);

        if ( (bDeleteAllHashes || false) === true ){
            await this.hashList.deleteHash('',sOldURL);
            return await this.hashList.deleteHash('',sNewURL);
        }

        if ((sOldURL || '') !== '')
            await this.hashList.deleteHash('',sOldURL);

        return this.addNewURL('', sNewURL, object);
    }

    async checkUniqueURL(sURL){
        return await this.hashList.getHash('',sURL);
    }

    async test(){

        this.addNewURL('',"URL1","1");
        this.addNewURL('',"URL2","2");
        this.addNewURL('',"URL3","3");
        this.addNewURL('',"URL3","3");
        this.addNewURL('',"URL3","3");
        this.addNewURL('',"URL3","3");
        this.addNewURL('',"URL4","4");
        console.log("URL ADD NEW IDENTICALLY ",await this.addNewURL('',"URL2","3"));

        console.log("URL REPLACE ",await this.replaceOldURL("URL2","URL2_SCHIMBAT","22_schimbat"));
    }

};

module.exports = new URLHash();