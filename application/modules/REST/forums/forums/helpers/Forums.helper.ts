/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/26/2017.
 * (C) BIT TECHNOLOGIES
 */

var forumModel = require ('./../models/Forum.model.ts');
var commonFunctions = require ('../../../common/helpers/common-functions.helper.ts');
var URLHashHelper = require ('../../../common/URLs/helpers/URLHash.helper.ts');
var MaterializedParentsHelper = require ('../../../../DB/common/materialized-parents/MaterializedParents.helper.ts');

module.exports = {

    createDummyForum (iIndex){

        iIndex = iIndex || 0;

        return this.addForum("forum_"+iIndex,"userDummy_"+iIndex, "123456","Gigel",
            "Nume"+iIndex,"RO","Bucharest", "RO", "http://www.gravatar.com/avatar/ee4d1b570eff6ce63"+iIndex+"?default=wavatar&forcedefault=1",
            "http://www.hdfbcover.com/randomcovers/covers/never-stop-dreaming-quote-fb-cover.jpg");
    },

    /*
        FINDING & LOADING FORUM from ID, URL
     */
    async findForum(sRequest){

        console.log("Finding forum :::  " + sRequest);

        var forumFound = await this.findForumById(sRequest);

        return new Promise((resolve) =>{

            //console.log('FORUM FOUND'); console.log(userFound);
            //console.log('answer from email....'); console.log(res);

            if (forumFound != null) resolve (forumFound);
            else
                this.findForumByURL(sRequest).then ( (forumFound) => {
                    resolve (forumFound);
                })
        });

    },

    async findForumById (sId){

        return new Promise( (resolve)=> {

            if ((typeof sId === 'undefined') || (sId == []) || (sId === null))
                resolve(null);
            else

            //  console.log('finding forum '+sId);

            forumModel = redis.nohm.factory('ForumModel', sId, function (err, forum) {
                if (err) resolve (null);
                else resolve (forumModel);
            });

        });
    },

    findForumByURL (sURL)
    {
        sURL = sURL || "";
        return new Promise( (resolve)=> {
            if ((typeof sURL === 'undefined') || (sURL == []) || (sURL === null))
                resolve(null);
            else
                return null;

            //console.log('finding user '+sId);

            var ForumModel = redis.nohm.factory('ForumModel');
            ForumModel.findAndLoad({
                    URL: sURL,
            }, function (err, forums) {
                //console.log("response forums : from URL ", forums);

                if (forums.length) resolve(forums[0]);
                else resolve (null);
            });

        });
    },


    /*
     CREATING A NEW FORUM
     */
    async addForum (UserAuthenticated, parent, sTitle, sDescription, arrKeywords, sCountry, sCity, sLanguage, sIconPic, sCoverPic, sCoverColor, dbLatitude, dbLongitude, iTimeZone){

        sCountry = sCountry || ''; sCity = sCity || ''; sIconPic = sIconPic || ''; sCoverPic = sCoverPic || '';
        dbLatitude = dbLatitude || -666; dbLongitude = dbLongitude || -666; iTimeZone = iTimeZone || 0;

        sLanguage = sLanguage || sCountry;
        parent = parent || '';
        sCoverColor = sCoverColor || "#"+((1<<24)*Math.random()|0).toString(16);

        var forum = redis.nohm.factory('ForumModel');
        var errorValidation = {};


        //get object from parent


        forum.p(
            {
                title: sTitle,
                URL: await(URLHashHelper.getFinalNewURL(sTitle,null)), //Getting a NEW URL
                description: sDescription,
                authorId: UserAuthenticated.getUserId(),
                keywords: commonFunctions.convertKeywordsArrayToString(arrKeywords),
                iconPic: sIconPic,
                coverPic: sCoverPic,
                coverColor: sCoverColor,
                country: sCountry.toLowerCase(),
                city: sCity.toLowerCase(),
                language: sLanguage.toLowerCase(),
                dtCreation: new Date(),
                dtLastActivity: new Date(),
                timeZone : iTimeZone,
                parentId: MaterializedParentsHelper.getObjectId(parent),
                parents: MaterializedParentsHelper.findAllMaterializedParents(parent),
            }
        );

        if (dbLatitude != -666) forum.p('latitude', dbLatitude);
        if (dbLongitude != -666) forum.p('longitude', dbLongitude);

        return new Promise( (resolve)=> {

            if (Object.keys(errorValidation).length !== 0 ){

                resolve({result: false, errors: errorValidation});
                return false;
            }

            forum.save(function (err) {
                if (err) {
                    console.log("==> Error Saving Forum");
                    console.log(forum.errors); // the errors in validation

                    resolve({result:false, errors: forum.errors });
                } else {
                    console.log("Saving Forum Successfully");

                    forum.keepURLSlug(); //.then((answer)=>{
                    forum.keepSortedList();

                    console.log(forum.getPrivateInformation());

                    resolve( {result:true, forum: forum.getPrivateInformation() });
                }
            });

        });

    },



}


