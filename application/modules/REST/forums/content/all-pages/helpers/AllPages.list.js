let List = require ('../../../../../DB/Redis/lists/List.helper.js');

var AllPagesList = class {

    constructor (){
        this.list = new List("AllPages")
    }

    async getAllPages(parentId, pageIndex, pageCount=25){
        if (typeof parentId === 'object') parentId = parentId.id||'';

        pageIndex = Math.max(pageIndex, 1);
        pageCount = Math.min(pageCount|| 25, 25);

        let list = await this.list.listRange(parentId, (pageIndex-1) * pageCount, (pageIndex * pageCount)+1 );
        let listAdvanced = [];

        for (let i=0; i<Math.min(list.length, pageCount); i++)
            listAdvanced.push({'id': (pageIndex-1)* pageCount + i, 'page': list[i]});

        let hasNext = true;
        if (list.length <= pageCount) hasNext=false;

        return {result:true, list: listAdvanced, hasNext: hasNext, newPageIndex: pageIndex+1, pageCount : pageCount}
    }

    keepAllPagesList(parentId, url, remove=false){

        if (typeof parentId === 'object') parentId = parentId.id||'';
        if (typeof url === 'object') url = url.p('URL')||'';

        if ((parentId === null)) return false; //there is empty parent... (homepage)
        if (url === '') return false;

        if (remove === true){
            this.list.listRemove(parentId, url);
            return true;
        } else {
            this.list.listLeftPush(parentId, url);
            return true;
        }
    }

    deleteAllPagesList(parentId){
        if (typeof parentId === 'object') parentId = parentId.id||'';

        this.list.deleteList(parentId)
    }

};

module.exports = new AllPagesList();