/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/5/2017.
 * (C) BIT TECHNOLOGIES
 */

import MaterializedParentsHelper from 'DB/common/materialized-parents/MaterializedParents.helper';
import VotingsHashList from 'REST/voting/helpers/Votings.hashlist.js'

class ContentHelper {

    async setIcon(userAuthenticated, id, icon){

        let object = await MaterializedParentsHelper.findObject(id);
        let type = MaterializedParentsHelper.extractObjectTypeFromId(id);

        if (object === null) return {result:false, message: 'Object not found'};

        if (object.isOwner(userAuthenticated) === false)
            return {result:false, message: 'No rights to change the icon / profile Pic'};

        switch (type){
            case 'forum':
            case 'topic':
                object.p('iconPic',icon);
                break;
            case 'user':
                object.p('profilePic',icon);
                break;
        }

        return new Promise( (resolve)=> {
            object.save(function (err){
                if (err) {
                    console.log("==> Error Saving the Icon");
                    resolve({result: false, message: 'error'})
                } else{
                    console.log("ICON SET SUCCESSFULLY");
                    resolve ({result: true,  object: object.getPublicInformation(userAuthenticated) })
                }
            });
        });
    }

    async setCover(userAuthenticated, id, cover){

        let object = await MaterializedParentsHelper.findObject(id);
        let type = MaterializedParentsHelper.extractObjectTypeFromId(id);

        if (object === null) return {result:false, message: 'Object not found'};

        if (object.isOwner(userAuthenticated) === false)
            return {result:false, message: 'No rights to change the cover'};

        switch (type){
            case 'forum':
            case 'topic':
            case 'user':
                object.p('coverPic',cover);
                break;
        }

        return new Promise( (resolve)=> {
            object.save(function (err){
                if (err) {
                    console.log("==> Error Saving the Icon");
                    resolve({result: false, message: 'error'})
                } else{
                    resolve ({result: true,  object: object.getPublicInformation(userAuthenticated) })
                }
            });
        });
    }

    async deleteObject(userAuthenticated, id){

        let object = await MaterializedParentsHelper.findObject(id);
        let type = MaterializedParentsHelper.extractObjectTypeFromId(id);

        if (object === null) return {result:false, message: 'Object "'+id+'" not found'};

        if (object.isOwner(userAuthenticated) === false)
            return {result:false, message: 'No rights to delete the object'};

        switch (type){
            case 'forum':
            case 'topic':
            case 'reply':
                await object.keepURLSlug('', true);
                await object.keepParentsStatistics(-1);
                break;
        }

        var SearchesHelper = require ('../../../searches/helpers/Searches.helper.js');
        //should delete the search data///

        await VotingsHashList.deleteVoting(id);

        return new Promise( (resolve)=> {
            object.remove(function (err){
                if (err) {
                    console.log("==> Error Deleting object ",id);
                    resolve({result: false, message: 'error'})
                } else{
                    resolve ({result: true })
                }
            });
        });
    }

}

export default new ContentHelper();