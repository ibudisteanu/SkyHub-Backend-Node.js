/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/17/2017.
 * (C) BIT TECHNOLOGIES
 */



import MetaExtractorHelper from './helpers/MetaExtractor.helper'

class MetaExtractorController {

    /*
     REST API
     */

    async extractDataFromLink (req, res){

        let sLink = '';

        if (req.hasOwnProperty('body')){
            sLink = req.body.link || '';
        }

        console.log('extracting data from link: ', sLink);

        let result = await MetaExtractorHelper.extractDataFromLink(sLink);

        if (result !== null)
            return {result:true, data: result};
        else
            return {result:false, message: "error extracting the data"};

    }

}

export default new MetaExtractorController()