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

        if (url.indexOf("http") < 0) url = "http"+url;
        if (url.indexOf("https") === 0) url.replace("https","http");
        if (url.indexOf("www.")) url.replace("www.","");

        return url;

    }

    async getMetaData(url){

        url = this.fixURL(url);
        if ((url === null)||(url.length < 3)) return null;

        return await this.hashList.getHash('',url);
    }

    async setMetaData(url, data){

        url = this.fixURL(url);
        if ((url === null)||(url.length < 3)) return null;

        if (await this.getMetaData(url) === null)
            return await this.hashList.setHash('',url, data);
    }

    async test(){

    }

};

module.exports = new SessionHash();