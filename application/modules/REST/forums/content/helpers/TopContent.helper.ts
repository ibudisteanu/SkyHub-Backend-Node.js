/**
 * Created by BIT TECHNOLOGIES on 6/1/2017.
 */

var SortedList = require ('../../../../DB/Redis/sorted-list/SortedList.helper.ts');
var MaterializedParents = require ('../../../../DB/common/materialized-parents/MaterializedParents.helper.ts');

class TopContent {

    //sortedList
    constructor(){
        this.sortedList = new SortedList("TopContent");
    }

    async getTopContent(UserAuthenticated, parent){

        var sParentId = MaterializedParents.getObjectId(parent);

        this.sortedList.getFastItems(sParentId, 0, 8 );

    }

    async test(){

        this.sortedList.addElement("",33,"Salut1");
        this.sortedList.addElement("",55,"Salut2");
        this.sortedList.addElement("",66,"Salut3");
        this.sortedList.addElement("",626,"Salut4");
        this.sortedList.addElement("",26,"Salut5");
        this.sortedList.addElement("",15,"Salut6");
        this.sortedList.addElement("",6,"Salut7");

        console.log("DELETE Salut4 ",await this.sortedList.deleteElement("","Salut4"));

        console.log("UPDATE SALUT3", await this.sortedList.updateElement("",2666,"Salut3"));


        console.log("rank1", await this.sortedList.getRankItem("","Salut5"));
        console.log("rank1", await this.sortedList.getRankItem("","Salut3"));
        console.log("COUNT LIST: ",await this.sortedList.countList(""));

        console.log("COUNT LIST BETWEEN ", await this.sortedList.countListBetweenMinMax("",50,400));

        for (var i=0; i<7; i++)
            console.log("GET ITEM "+i+"   ", await this.sortedList.getItemsMatching(""));


        console.log("GET LIST RANGE BY SORTED INDEX ", await this.sortedList.getListRangeBySortedIndex("",1,5));

        console.log("GET LIST RANGE BY SCORE ", await this.sortedList.getListRangeByScore("",30,600));

    }
    
};

module.exports = new TopContent();