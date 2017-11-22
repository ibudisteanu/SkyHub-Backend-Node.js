/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/17/2017.
 * (C) BIT TECHNOLOGIES
 */

/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */

var HashList = require ('DB/Redis/lists/HashList.helper.js');

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

        if (url.indexOf("youtube.com") >= 0) {   // https://www.youtube.com/watch?v=jylD0pLXn1k => https://youtu.be/jylD0pLXn1k =>
            url.replace("watch?v=","");
            url.replace("youtube.com","youtu.be");
        }

        return url;

    }


    isValidURL(url) {
        return url.match(/^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})(.*)$/);
    }

    async getMetaData(url){

        url = this.fixURL(url);
        if (!this.isValidURL(url)) return null;

        let res = await this.hashList.getHash('',url);
        if (res !== null)
            return JSON.parse( res );

        return null;
    }

    async setMetaData(url, data){

        url = this.fixURL(url);
        if (!this.isValidURL(url)) return null;

        if (await this.getMetaData(url) === null)
            return await this.hashList.setHash('',url, data);
    }

    async test(){

    }

}

export default new MetaExtractorHashList();