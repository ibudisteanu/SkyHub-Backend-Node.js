/**
 * Created by ERAZER-ALEX on 6/4/2017.
 */

import TopContentHelper from './helpers/TopContent.helper';
import AuthenticatingUser from 'REST/users/auth/helpers/AuthenticatingUser.helper';

export default {

    /*
     REST API
     */

    async postGetTopContent (req, res){

        let sParent = ''; let iPageIndex=1; let iPageCount = 8;

        console.log("----"); console.log("----"); console.log("----"); console.log("----");
        console.log("body",req.body);

        if (req.hasOwnProperty('body')){
            sParent = req.body.parent || '';
            iPageIndex = req.body.pageIndex || 1;
            iPageCount = req.body.pageCount || 8;
        }

        console.log('Getting Top Content : ', sParent);

        return TopContentHelper.getTopContent(req.userAuthenticated, sParent, iPageIndex, iPageCount);

    },

    async postGetContent (req, res){

        let sId = '';

        if (req.hasOwnProperty('body')){

            sId = req.body.id ||'';

        }

        console.log(""); console.log(""); console.log(""); console.log("");
        //console.log(req);
        console.log('Getting Content : ', '"'+sId,res.body);

        return TopContentHelper.getContent(req.userAuthenticated, sId);

    }


}