let List = require ('../../../../../DB/Redis/lists/List.helper.js');

var AllPagesList = class {

    constructor (){
        this.list = new List("AllPages")
    }

    async getAllPages(parentId, index, pageCount=25){
        if (typeof parentId === 'object') parentId = parentId.id||'';

        pageCount = Math.min(pageCount|| 25, 25);

        list = await list.listRange(parentId, (index-1) * 25, (index * 25)+1 );

        hasNext = true;
        if (list <= pageCount) hasNext=false;

        return {'list': list, hasNext: hasNext}
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