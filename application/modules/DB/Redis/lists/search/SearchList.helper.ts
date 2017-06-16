/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */
/*

    TUTORIAL BASED ON http://blog.katpadi.ph/autocomplete-with-redis/
                      http://patshaughnessy.net/2011/11/29/two-ways-of-using-redis-to-build-a-nosql-autocomplete-search-index

 */
var SortedList = require ('./../sorted-lists/SortedList.helper.ts');
var XRegExp = require ('xregexp');

class SearchList {

    //sortedList
    constructor(sPrefix){
        this.sortedList = new SortedList("Search:"+(sPrefix||"name"));
        this.minimumWordLength = 3;
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

        let iCount = 0;

        let regexUnicodeWord = XRegExp('^\\pL+$');

        let sPrefix = '';
        for (let i=0; i<phrase.length; i++){

            if (regexUnicodeWord.test(phrase[i])){ //i found a letter
                sPrefix = sPrefix+ phrase[i];
            } else
                sPrefix = '';

            console.log("prefix",sPrefix);

            if (sPrefix !== '') {
                console.log("creating search prefix", sPrefix);
                await this.sortedList.updateElement(sPrefix, score, index);
                iCount++;
            }

        }

        if (sPrefix !== '') {
            await this.sortedList.updateElement(sPrefix, score, index);
            iCount++;
        }

        return iCount;
    }

    async searchSimpleWord(word){

        if (word === null) return [];
        if (typeof word !== "string") return [];
        if (word.length < this.minimumWordLength) return []; //to few letters... no autocomplete

        word = word.toLowerCase();

        return await this.sortedList.getListRangeBySortedIndex(word,1,10);
    }

    /*
        USING INTERSECTIONS see docs http://patshaughnessy.net/2011/11/29/two-ways-of-using-redis-to-build-a-nosql-autocomplete-search-index
     */
    async searchPhrase(phrase){

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

                if ((sPrefix !== '')&&(sPrefix.length>=this.minimumWordLength)) arrPartialWordsToSearch.push(sPrefix);

                sPrefix = '';
            }

        }

        if ((sPrefix !== '')&&(sPrefix.length>=this.minimumWordLength)) arrPartialWordsToSearch.push(sPrefix);

        let sOutputName = '';

        for (let i=0; i<arrPartialWordsToSearch.length; i++)
            sOutputName = sOutputName + arrPartialWordsToSearch[i]+ '|';

        sOutputName.replace(/|$/,"");

        let result = await this.sortedList.intersectionInStore(sOutputName, arrPartialWordsToSearch);

        if (result !== null){
            return await this.sortedList.getListRangeBySortedIndex(sOutputName,1,10);
        }

        return [];
    }


    async test(){


        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("MAMA ARE MERE SI TATA SE DUCE ACASA",1,5));
        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("TATA ARE MASINA SI MAMA ARE PERE",2,5));
        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("SkyHub is fucking awesome",2,5));
        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("I hope search is working and SkyHub is great",2,5));

        console.log("simple search",await this.searchSimpleWord("MASINA"));
        console.log("simple search",await this.searchSimpleWord("MAMA"));
        console.log("simple search",await this.searchSimpleWord("SkyH"));

    }

};

module.exports = SearchList;