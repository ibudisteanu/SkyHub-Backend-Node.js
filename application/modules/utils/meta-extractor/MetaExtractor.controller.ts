/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/17/2017.
 * (C) BIT TECHNOLOGIES
 */



var MetaExtractor = require ('./helpers/MetaExtractor.helper.ts');

module.exports = {

    /*
     REST API
     */

    async extractDataFromLink (req, res){

        let sLink = '';

        if (req.hasOwnProperty('body')){
            sLink = req.body.link || '';
        }

        console.log('extracting data from link: ', sLink);

        return MetaExtractor.extractDataFromLink(sLink);

    },

}