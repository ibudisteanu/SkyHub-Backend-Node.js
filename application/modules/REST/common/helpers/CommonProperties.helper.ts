/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/16/2017.
 * (C) BIT TECHNOLOGIES
 */


module.exports = {
    /*
     HELPER FUNCTIONS
     */

    getMaterializedParents(sParentsList){

       return sParentsList.splot(",");

    },

    findMaterializedParents(sParentsList){

        var arrParentsList = this.getMaterializedParents(sParentsList);

    }

}

