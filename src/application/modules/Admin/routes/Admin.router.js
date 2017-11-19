/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

let express = require('express');
let router = express.Router();


/*
 ADMIN
 */

// api/admin/XXXXX

router.get('/sort', async function (req, res){
    let AdminCtrl = require ('../Admin.controller.js');
    res.json( {message: AdminCtrl.sort() });
});

router.get('/replace-uploaded-files-substring', async function (req, res){
    let AdminCtrl = require ('../Admin.controller.js');
    //res.json( {message: AdminCtrl.replaceUploadedFilesSubstring("myskyhub.ddns.net:4000","skyhub.me:4000") });
    //res.json( {message: AdminCtrl.replaceUploadedFilesSubstring("http://skyhub.me:4000/uploads","http://skyhub.me:4000/public/uploads") });
    res.json( {message: AdminCtrl.replaceUploadedFilesSubstring("myskyhub.ddns.net:4000","skyhub.me:4000") });
});


router.get('/build-notifications-subscribers-lists', async function (req, res){
    let AdminCtrl = require ('../Admin.controller.js');
    res.json( {message: AdminCtrl.buildNotificationsSubscribersLists() });
});

router.get('/build-all-pages-lists', async function (req, res){
    let AdminCtrl = require ('../Admin.controller.js');
    res.json( {message: AdminCtrl.buildAllPagesLists() });
});


module.exports = router;