/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/17/2017.
 * (C) BIT TECHNOLOGIES
 */

// based on this https://www.npmjs.com/package/node-metainspector

var MetaInspector = require('node-metainspector');
var MetaExtractorHashList = require('./../meta-extractor-list/MetaExtractorHashList.helper.ts');

module.exports = {

    /*
     REST API
     */

    async fetchURLData(sLink){

        return new Promise( (resolve)=> {

            var client = new MetaInspector(sLink, { timeout: 7000 });

            client.on("fetch", function(){

                resolve(client);
            });

            client.on("error", function(err){
                console.log("fetching url data ",err);
                resolve(null);
            });

            client.fetch();

        });

    },

    async extractDataFromLink (sLink){

        sLink = MetaExtractorHashList.fixURL(sLink); //fixing the URL, avoiding duplicate URLs
        console.log('processing link...',sLink);
        if (!MetaExtractorHashList.isValidURL(sLink)) return null;

        let hashData = await MetaExtractorHashList.getMetaData(sLink);
        if (hashData !== null) return hashData;

        let client = await this.fetchURLData(sLink);

        if (client !== null){

            let data = {
                url: client.url,
                scheme: client.scheme,
                rootUrl: client.rootUrl,

                title: client.ogTitle||client.title,
                description: client.ogDescription||client.description,

                author: client.author,
                keywords: client.keywords,
                charset: client.charset,
                image: client.ogImage||client.image,
                images: Array.isArray(client.images) ? client.images : [],

                type: client.type,
                updatedTime: client.ogUpdatedTime,
                locale: client.ogLocale,

                date: new Date(),
            };

            MetaExtractorHashList.setMetaData(sLink, data);
            console.log("saving");

            return data;

        }

        return null;

    },

    async test(){

        console.log(await this.extractDataFromLink("http://google.ro"));
        console.log(await this.extractDataFromLink("http://facebook.com"));
        console.log(await this.extractDataFromLink("facebook.com"));
        console.log(await this.extractDataFromLink("facebook.com"));
        console.log(await this.extractDataFromLink("http://facebook.com"));
        console.log(await this.extractDataFromLink("http://money.cnn.com/2016/11/10/technology/tech-reaction-election-trump/index.html"));

        console.log("DONE");

    }

}