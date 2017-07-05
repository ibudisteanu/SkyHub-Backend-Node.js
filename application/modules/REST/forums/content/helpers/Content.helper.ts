/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/5/2017.
 * (C) BIT TECHNOLOGIES
 */

class ContentHelper {

    async setIcon(userAuthenticated, id, icon){

        let object = await MaterializedParentsHelper.findObject(id);
        let type = MaterializedParentsHelper.extractObjectTypeFromId(id);

        switch (type){
            case 'forum':
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
                    resolve ({result: true,  object: object.getPublicInformation(userAuthenticated) })
                }
            });
        });
    }

    async setCover(userAuthenticated, id, cover){

        let object = await MaterializedParentsHelper.findObject(id);
        let type = MaterializedParentsHelper.extractObjectTypeFromId(id);

        switch (type){
            case 'forum':
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

};

module.exports = new ContentHelper();