/**
 * Created by BIT TECHNOLOGIES on 6/1/2017.
 */

var SortedList = require ('../../../../DB/Redis/lists/SortedList.helper.ts');
var MaterializedParents = require ('../../../../DB/common/materialized-parents/MaterializedParents.helper.ts');

class TopContent {

    //sortedList
    constructor(){
        this.sortedList = new SortedList("TopContent");
    }

    async getTopContent(UserAuthenticated, parent, pageIndex, pageCount){

        var sParentId = MaterializedParents.getObjectId(parent);

        pageCount = Math.min(pageCount|| 8,10);

        let listTopContent = await this.sortedList.getFastItems(sParentId, pageIndex||1, pageCount );

        if (listTopContent !== []){

            let listTopContentObjects = [];

            /* method using zscan...
            for (let i=0; i<listTopContent[1].length/2; i++){
                let id = listTopContent[1][2*i];
                let score = listTopContent[1][2*i+1];
            */
            for (let i=0; i<listTopContent.length; i++){

                let id = listTopContent[i];

                let object = await MaterializedParents.findObject(id);

                //console.log("LIST TOP CONTENT :::: ",id, score);
                //console.log("TOP CONTENT OBJECT FOUND: ", object);

                if (object !== null){
                    listTopContentObjects.push({
                        object : object.getPublicInformation(),
                        //score: score,
                    })
                }

            }

            return({
                result: true,
                next: listTopContent.length !== pageCount,
                newPageIndex: pageIndex+1,
                content: listTopContentObjects,
            });

        }

        return({
            result: false,
            content: [],
        });

    }

    async getContent(UserAuthenticated, id){

        let object = await MaterializedParents.findObject(id);

        if (object !== null){
            return({
                result: true,
                content: object.getPublicInformation(),
            })
        }

        return({
            result: false,
            content: [],
        })

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


        console.log("GET ITEMS   ", await this.sortedList.getItemsMatching(""));


        console.log("GET LIST RANGE BY SORTED INDEX ", await this.sortedList.getListRangeBySortedIndex("",1,5));

        console.log("GET LIST RANGE BY SCORE ", await this.sortedList.getListRangeByScore("",30,600));

    }
    
};

module.exports = new TopContent();