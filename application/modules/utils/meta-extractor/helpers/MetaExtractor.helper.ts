/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/17/2017.
 * (C) BIT TECHNOLOGIES
 */

// based on this https://www.npmjs.com/package/node-metainspector

var MetaInspector = require('node-metainspector');


module.exports = {

    /*
     REST API
     */

    async fetchData(sLink){

        return new Promise( (resolve)=> {

            var client = new MetaInspector(sLink, { timeout: 7000 });

            client.on("fetch", function(){

                resolve(client);
            });

        });

    },

    async extractDataFromLink (sLink){

        let client = await this.fetchData(sLink);

        if (client !== null){

            return {
                url: client.url,
                scheme: client.scheme,
                rootUrl: client.rootUrl,

                title: client.ogTitle||client.title,
                description: client.ogDescription||client.description,

                author: client.author,
                keywords: client.keywords,
                charset: client.charset,
                image: client.image,
                images: client.images,

                type: client.type,
                updatedTime: client.ogUpdatedTime,
                locale: client.ogLocale,
            }

        }

    },

}