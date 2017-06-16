/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/17/2017.
 * (C) BIT TECHNOLOGIES
 */

/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */

var HashList = require ('../../../DB/Redis/lists/HashList.helper.ts');

class MetaExtractorHashList {

    //sortedList
    constructor(){
        this.hashList = new HashList("MetaExtractor");
    }

    fixURL(url){

        if (url === null) return null;

        url = url.replace("https://","");
        url = url.replace("http://","");

        if (url.indexOf("www.") < 3) url.replace("www.","");

        return url;

    }


    isValidURL(url) {
        return url.match(/^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})(.*)$/);
    }

    async getMetaData(url){

        url = this.fixURL(url);
        if (!this.isValidURL(url)) return null;

        return JSON.parse( await this.hashList.getHash('',url) );
    }

    async setMetaData(url, data){

        url = this.fixURL(url);
        if (!this.isValidURL(url)) return null;

        if (await this.getMetaData(url) === null)
            return await this.hashList.setHash('',url, data);
    }

    async test(){

    }

};

module.exports = new MetaExtractorHashList();