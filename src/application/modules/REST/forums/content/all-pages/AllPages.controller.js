/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/14/2017.
 * (C) BIT TECHNOLOGIES
 */

import AllPagesList from 'REST/forums/content/all-pages/helpers/AllPages.list'

module.exports = {

    /*
     REST API
     */

    async postGetAllPages(req, res) {

        let sParent = '';
        let iPageIndex = 1;
        let iPageCount = 8;

        if (req.hasOwnProperty('body')) {
            sParent = req.body.parent || '';
            iPageIndex = req.body.pageIndex || 1;
            iPageCount = req.body.pageCount || 25;
        }

        return await AllPagesList.getAllPages(sParent, iPageIndex, iPageCount);
    },

};