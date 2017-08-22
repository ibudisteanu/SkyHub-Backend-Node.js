/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

var express = require('express');
var router = express.Router();


/*
 ADMIN
 */

// api/admin/XXXXX

router.get('/sort', function (req, res){
    let AdminCtrl = require ('./../Admin.controller.ts');
    res.json( {message: AdminCtrl.sort() });
});

router.get('/replace-uploaded-files-substring', function (req, res){
    let AdminCtrl = require ('./../Admin.controller.ts');
    //res.json( {message: AdminCtrl.replaceUploadedFilesSubstring("myskyhub.ddns.net:4000","skyhub.me:4000") });
    //res.json( {message: AdminCtrl.replaceUploadedFilesSubstring("http://skyhub.me:4000/uploads","http://skyhub.me:4000/public/uploads") });
    res.json( {message: AdminCtrl.replaceUploadedFilesSubstring("myskyhub.ddns.net:4000","skyhub.me:4000") });
});


module.exports = router;