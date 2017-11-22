/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

import SearchesHelper from 'REST/searches/helpers/Searches.helper'

module.exports = {

    /*
     REST API
     */

    async searchParents (req, res){

        let sText = '';

        if (req.hasOwnProperty('body')){
            sText = req.body.text || '';
        }

        console.log('Search Parents : ', sText);

        return SearchesHelper.searchParents(sText);

    },

}