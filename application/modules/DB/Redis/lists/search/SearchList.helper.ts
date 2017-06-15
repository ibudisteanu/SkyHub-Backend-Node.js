/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */
/*

    TUTORIAL BASED ON http://blog.katpadi.ph/autocomplete-with-redis/
                      http://patshaughnessy.net/2011/11/29/two-ways-of-using-redis-to-build-a-nosql-autocomplete-search-index

 */
var SortedList = require ('./../sorted-lists/SortedList.helper.ts');

class SearchList {

    sortedList;


    //sortedList
    constructor(sPrefix){
        this.sortedList = new SortedList("Search:"+sPrefix||"name");
    }

    /*
        PREFIX BUILDING...

        word = "MAMA ARE MERE"
        tabel:M    => index|score
        tabel:MA   => index|score
        tabel:MAM  => index|score
        tabel:MAMA => index|score

        tabel|A    => index|score
        tabel|R    => index|score
        tabel|E    => index|score

     */
    async createSearchPrefixes(phrase, index, score){

        if (phrase === null) return false;
        if (typeof phrase !== "string") return false;

        phrase = phrase.toLowerCase();

        let sPrefix = '';
        for (let i=0; i<phrase.length; i++){

            if (! /^[a-z]+$/g.test(phrase[i])){ //i found a letter
                sPrefix = sPrefix+ phrase[i];
            } else
                sPrefix = '';

            if (sPrefix !== '')
                this.sortedList.updateElement(sPrefix, score,index);

        }
    }

    async autocompleteSimpleWord(word){

        if (word === null) return [];
        if (typeof word !== "string") return [];
        if (word.length < 3) return []; //to few letters... no autocomplete

        word = word.toLowerCase();

        return await this.sortedList.getListRangeBySortedIndex(word,1,10);
    }

    async autocompleteIntersection(phrase){

        if (phrase === null) return false;
        if (typeof phrase !== "string") return false;
        if (phrase.length < 3) return [];

        phrase = phrase.toLowerCase();

        let arrPartialWordsToSearch = []; // the extracted words used for interogating
        let arrPartialResults = []; // partial results from the DB

        //filter which words will be used as "keywords" for autocomplete

        let sPrefix = '';
        for (let i=0; i<phrase.length; i++){

            if (! /^[a-z]+$/g.test(phrase[i])){ //i found a letter
                sPrefix = sPrefix+ phrase[i];
            } else {

                if ((sPrefix !== '')&&(sPrefix.length>=3)) arrPartialWordsToSearch.push(sPrefix);

                sPrefix = '';
            }

        }

        if ((sPrefix !== '')&&(sPrefix.length>=3)) arrPartialWordsToSearch.push(sPrefix);

        for (let i=0; i<arrPartialWordsToSearch.length; i++){

            let zlistAnswer = await this.sortedList.getListRangeByScore(arrPartialWordsToSearch[i], 1, 100); // first 100 elements

            if (zlistAnswer.length > 0){
                arrPartialResults.push(zlistAnswer);
            }
        }

        let answer = [];

        if (arrPartialResults.length > 0)  //computing the intersections https://redis.io/commands/zinterstore
            for (let i=0; i<arrPartialResults.length; i++){

            }

        return answer;

    }


    async test(){



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

module.exports = TopObjectsList;