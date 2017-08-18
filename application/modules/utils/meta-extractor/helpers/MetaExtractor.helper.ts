/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/17/2017.
 * (C) BIT TECHNOLOGIES
 */

// based on this https://www.npmjs.com/package/node-metainspector

var MetaInspector = require('node-metainspector');
var MetaExtractorHashList = require('./../meta-extractor-list/MetaExtractorHashList.helper.ts');

const http = require('http');
const fileType = require('file-type');


var request = require('request');

var magic = {
    jpg: ['ffd8ffe0','ffd8ffdb','ffd8ffe1'],
    png: ['89504e47'],
    gif: ['47494638'],
};

function checkMagicNumber(imageChunk, magicArray){

    for (let i=0; i<magicArray.length; i++){
        let magicNumberInBody = imageChunk.toString('hex', 0, Math.floor(magicArray[i].length/2));
        if (magicNumberInBody === magicArray[i])
            return true;
    }
    return false;
}


module.exports = {

    /*
     REST API
     */

    getImageExtension(url, timeout){

        console.log('getImageExtension2',url);

        var options = {
            method: 'GET',
            url: url,
            encoding: null // keeps the body as buffer
        };

        return new Promise(function (resolve, reject) {
            request(options, function (err, response, body) {
                if (!err && response.statusCode == 200) {

                    if (checkMagicNumber(body, magic.jpg)) resolve({result: true, type:'jpg'}); else
                    if (checkMagicNumber(body, magic.png)) resolve({result: true, type:'png'}); else
                    if (checkMagicNumber(body, magic.gif)) resolve({result: true, type:'gif'}); 
                    else
                    resolve({result: false});

                }
            });
        });
    },

    // getImageExtension(url, timeout){
    //
    //     url = "http://"+url;
    //     console.log('getImageExtension2',url);
    //     return new Promise(function (resolve, reject) {
    //         http.get(url, res => {
    //             res.once('data', chunk => {
    //                 res.destroy();
    //                 console.log("imageType",chunk, fileType(chunk));
    //                 resolve(fileType(chunk));
    //                 //=> {ext: 'gif', mime: 'image/gif'}
    //             });
    //         });
    //     });
    // },

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

    getRootUrl(url) {
       return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
    },

    async extractDataFromLink (sLink){

        sLink = MetaExtractorHashList.fixURL(sLink); //fixing the URL, avoiding duplicate URLs

        //console.log('processing link...',sLink);
        if (!MetaExtractorHashList.isValidURL(sLink)) return null;

        if (sLink.indexOf("http") === -1){
            sLink = "http://"+sLink;
        }

        let hashData = await MetaExtractorHashList.getMetaData(sLink);

        console.log(hashData);
        if ((hashData !== null)&&(typeof hashData !== "undefined")&&(typeof hashData['url'] !== 'undefined')&&(hashData['url'].length > 2)) return hashData;

        let client = null, data = null;

        console.log('awesome');
        console.log("result from getImageExtension ", await this.getImageExtension(sLink,5000));

        client = await this.getImageExtension(sLink,5000);
        if ( client.result === true){

            data = {
                url: sLink,
                scheme: 'http',
                rootUrl: this.getRootUrl(sLink),
                title: (sLink.substr(sLink.lastIndexOf('/') + 1)),

                image: sLink,
                images: [sLink],

                type: 'image',
                extension: client.type,

                date: new Date().getTime(),
            }
        } else {
            client = await this.fetchURLData(sLink);

            if (client !== null) {

                // if (sLink.indexOf("youtu.be") >= 0){ //extract youtube image
                //     //https://youtu.be/jylD0pLXn1k => => http://img.youtube.com/vi/jylD0pLXn1k/0.jpg
                //     client.image = "http://img.youtube.com/vi/"+ sLink.substring(sLink.indexOf("youtu.be")+"youtu.be".length+1);
                // }

                data = {
                    url: client.url,
                    scheme: client.scheme,
                    rootUrl: client.rootUrl,

                    title: client.ogTitle || client.title,
                    description: client.ogDescription || client.description,

                    author: client.author,
                    keywords: client.keywords,
                    charset: client.charset,
                    image: client.ogImage || client.image,
                    images: Array.isArray(client.images) ? client.images : [],

                    type: client.type,
                    updatedTime: client.ogUpdatedTime,
                    locale: client.ogLocale,

                    date: new Date().getTime(),
                };

            }
        }

        if (data !== null){
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