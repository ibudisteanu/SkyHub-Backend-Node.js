/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */
/*

    TUTORIAL BASED ON http://blog.katpadi.ph/autocomplete-with-redis/
                      http://patshaughnessy.net/2011/11/29/two-ways-of-using-redis-to-build-a-nosql-autocomplete-search-index

 */
var SortedList = require ('../sorted-lists/SortedList.helper.js');
var AutoCompleteStringsHashList = require ('./AutoCompleteStringsHashList.helper.js');

var commonFunctions = require ('../../../../REST/common/helpers/CommonFunctions.helper.js');

class SearchList {

    //sortedList
    constructor(sPrefix){
        this.sortedList = new SortedList("Search:"+(sPrefix||"name"), 300);
        this.minimumWordLength = 3;
    }

    setNewTablePrefix(sNewPrefix){
        this.sortedList.setNewTablePrefix("Search:"+sNewPrefix);
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
    async createSearchPrefixes(phrase, parent, score){

        if (phrase === null) return false;
        if (typeof phrase !== "string") return false;
        if (parent === null) return false;

        if (typeof parent === 'object') parent = parent.id||null; // if it is a NOHM object, then I extract the ID
        if (parent === null) return false;

        let autoCompleteHashIndex = await AutoCompleteStringsHashList.addAutoCompleteString(phrase, parent );
        // let type = MaterializedParents.extractObjectTypeFromId(parent);
        // let autoCompleteHashIndex = parent;

        phrase = phrase.toLowerCase();
        phrase = commonFunctions.transliterate(phrase);

        let iCount = 0;

        let sPrefix = '';
        for (let i=0; i<phrase.length; i++){

            if (commonFunctions.validateUnicodeString(phrase[i])){ //i found a letter
                sPrefix = sPrefix+ phrase[i];
            } else
                sPrefix = '';

            //console.log("prefix",sPrefix);

            if ((sPrefix !== '')&&(sPrefix.length >= this.minimumWordLength)) {
                //console.log("creating search prefix", sPrefix);
                await this.sortedList.updateElement(sPrefix, score, autoCompleteHashIndex);
                iCount++;
            }

        }

        if ((sPrefix !== '')&&(sPrefix.length >= this.minimumWordLength)) {
            await this.sortedList.updateElement(sPrefix, score, autoCompleteHashIndex);
            iCount++;
        }

        return iCount;
    }

    async searchSimpleWord(word){

        if (word === null) return [];
        if (typeof word !== "string") return [];
        if (word.length < this.minimumWordLength) return []; //to few letters... no autocomplete
        word = word.toLowerCase();
        word = commonFunctions.transliterate(word);

        return await AutoCompleteStringsHashList.getAutoComplete(await this.sortedList.getListRangeBySortedIndex(word,1,10));
    }

    /*
        USING INTERSECTIONS see docs http://patshaughnessy.net/2011/11/29/two-ways-of-using-redis-to-build-a-nosql-autocomplete-search-index
     */
    async searchPhrase(phrase){

        if (phrase === null) return false;
        if (typeof phrase !== "string") return false;
        if (phrase.length < 3) return [];
        phrase = phrase.toLowerCase();
        phrase = commonFunctions.transliterate(phrase);

        let arrPartialWordsToSearch = []; // the extracted words used for interogating
        let arrPartialResults = []; // partial results from the DB

        //filter which words will be used as "keywords" for autocomplete

        let sPrefix = '';
        for (let i=0; i<phrase.length; i++){

            if (commonFunctions.validateUnicodeString(phrase[i])){ //i found a letter
                sPrefix = sPrefix + phrase[i];
            } else {

                if ((sPrefix !== '')&&(sPrefix.length>=this.minimumWordLength)) arrPartialWordsToSearch.push(sPrefix);

                sPrefix = '';
            }

        }

        if ((sPrefix !== '')&&(sPrefix.length>=this.minimumWordLength)) arrPartialWordsToSearch.push(sPrefix);

        let sOutputName = '';

        for (let i=0; i<arrPartialWordsToSearch.length; i++)
            sOutputName = sOutputName + arrPartialWordsToSearch[i]+ '&';

        sOutputName = sOutputName.replace(/.$/,"");

        let result = await this.sortedList.intersectionInStore(sOutputName, arrPartialWordsToSearch);

        //console.log("@@@@@@@@@@@@ answer ", result,"@@@@@", sOutputName);

        if (result !== null){
            return await AutoCompleteStringsHashList.getAutoComplete(await this.sortedList.getListRangeBySortedIndex(sOutputName,1,10));
        }

        return [];
    }


    async test(){


        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("MAMA ARE MERE SI TATA SE DUCE ACASA",1,5));
        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("TATA ARE MASINA SI MAMA ARE PERE",2,5));
        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("SkyHub is fucking awesome",3,5));
        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("I hope search is working and SkyHub is great",4,5));
        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("側経意責家方家閉討店暖育田庁載社転",5,5));
        console.log("CREATE SEARCH PREFIX", await this.createSearchPrefixes("Русский",6,5));

        console.log("simple search for MASINA ",await this.searchSimpleWord("MASINA"));
        console.log("simple search for MAMA",await this.searchSimpleWord("MAMA"));
        console.log("simple search for SkyH",await this.searchSimpleWord("SkyH"));

        console.log("SEARCH MASINA ",await this.searchPhrase("MASINA MAMA"));
        console.log("SEARCH for MAMA",await this.searchPhrase("MAMA ARE"));
        console.log("SEARCH for SkyH",await this.searchPhrase("SkyH"));

    }

};

module.exports = SearchList;