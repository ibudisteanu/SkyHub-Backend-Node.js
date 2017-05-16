/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/16/2017.
 * (C) BIT TECHNOLOGIES
 */

module.exports = {

    generateCommonIterator(callback, modelName){

        var sNewId = "1_"+modelName+"_"+new Date().valueOf()+Math.floor(Math.random()*10000);
        callback(sNewId);

        return sNewId;

    }

}