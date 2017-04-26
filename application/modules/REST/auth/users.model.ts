var redis = require ('../../DB/redis_nohm');
var userModel = require ('./user.model.ts');


module.exports = {

    createDummyUser : function(iIndex)
    {
        var user = redis.nohm.factory('UserModel');

        user.p(
            {
                username: "userDummy_"+iIndex,
                email: "emailDummy_"+iIndex+"@yahoo.com",
                password: "123456",
                profilePic: "http://www.gravatar.com/avatar/ee4d1b570eff6ce63"+iIndex+"?default=wavatar&forcedefault=1",
                coverPic: "http://www.hdfbcover.com/randomcovers/covers/never-stop-dreaming-quote-fb-cover.jpg",
                firstName: "Gigel",
                lastName: "Nume"+iIndex,
                country: "RO",
                city: "RO",
                language: "RO",
            }
        )


        user.save(function (err) {
            if (err) {
                console.log("==> Error Saving User");
                console.log(user.errors); // the errors in validation

                return {success:false, errors: user.errors };
            } else {
                console.log("Saving User Successfully");
                return {success:true, result: user };
            }
        });

    },

    findUserById : function (sId)
    {
        var user = redis.nohm.factory('UserModel', sId, function (err) {
            if (err) { // db error or id not found
                return null;
            }
        });

        return user;
    }

}