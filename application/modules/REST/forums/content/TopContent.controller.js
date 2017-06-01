/**
 * Created by BIT TECHNOLOGIES on 6/1/2017.
 */

SortedList = require ('../../../DB/Redis/sorted_list/sortedList.controller.js');

class TopContent {



    //sortedList
    constructor(){
        this.sortedList = new SortedList("TopContent");
    }

    async test(){

        this.sortedList.addElement("",33,"Salut1");
        this.sortedList.addElement("",55,"Salut2");
        this.sortedList.addElement("",66,"Salut3");
        this.sortedList.addElement("",626,"Salut4");
        this.sortedList.addElement("",26,"Salut5");
        this.sortedList.addElement("",6,"Salut6");


        console.log("rank1", await this.sortedList.getRankItem("","Salut5"));
        console.log("rank1", await this.sortedList.getRankItem("","Salut3"));
        console.log("COUNT LIST: ",await this.sortedList.countList(""));

        console.log("COUNT LIST BETWEEN ", await this.sortedList.countListBetweenMinMax("",50,400));

        console.log("GET ITEM", await this.sortedList.getItem("",2));

    }
    
};

module.exports = new TopContent();