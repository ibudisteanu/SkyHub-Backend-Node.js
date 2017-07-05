/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

var express = require('express');
var router = express.Router();


/*
 FILE UPLOAD
 */

const multer = require('multer');
let fileUploadURLPrefix = 'http://myskyhub.ddns.net:4000/';


const storageFile = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        // Mimetype stores the file type, set extensions according to filetype

        console.log("@@@@@@@@@@@@@@@@@@@", file.mimetype);
        switch (file.mimetype)
        {
            case 'image/jpeg':
                ext = '.jpeg';
                break;
            case 'image/jpg':
                ext = '.jpg';
                break;
            case 'image/png':
                ext = '.png';
                break;
            case 'image/gif':
                ext = '.gif';
                break;

            case 'application/pdf':
                ext = '.pdf';
                break;
            case 'application/doc':
                ext = '.doc';
                break;
            case 'application/docx':
                ext = '.docx';
                break;

            case 'application/zip':
                ext = '.zip';
                break;

            case 'application/rar':
                ext = '.rar';
                break;

            default:
                return false;
                break;
        }


        let sNewOriginalName = file.originalname;
        sNewOriginalName = sNewOriginalName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');
        sNewOriginalName = sNewOriginalName.slice(0, file.originalname.toLowerCase().indexOf(ext)) + Date.now() + ext;

        cb(null,  sNewOriginalName);
    }
});

function isMimeTypeFile(sFileName){
    if ((sFileName === 'image/jpeg')||(sFileName === 'image/jpg')||(sFileName==='image/png')||(sFileName==='image/png')||(sFileName==='application/pdf')||(sFileName==='application/doc')||(sFileName==='application/docx')||(sFileName==='application/zip')||(sFileName==='application/rar')) return true;

    return false;
}

const uploadFile = multer({storage: storageFile});
router.post('/topic-file',  uploadFile.single('file'), function (req, res, next) {

    console.log("@@@@@@@@@@@@@@ UPLOAD HANDLER");

    if (req.file && req.file.originalname) {
        console.log(`Received file ${req.file.originalname}`);

        let sFileURL = fileUploadURLPrefix+req.file.path.replace("public\\uploads\\","/uploads/");
        let sThumbnail = '';
        if (isMimeTypeFile(req.file.mimetype) ) sThumbnail = sFileURL;

        res.send({ result:true, type: req.file.mimetype, name: req.file.originalname, url: sFileURL, thumbnail: sThumbnail });
    } else
        res.send({ result:false});

});















const imageStorage = multer.diskStorage({
    destination: './public/uploads/images/',
    filename: function (req, file, cb) {
        // Mimetype stores the file type, set extensions according to filetype

        console.log("@@@@@@@@@@@@@@@@@@@", file.mimetype);

        switch (file.mimetype)
        {
            case 'image/jpeg':
                ext = '.jpeg';
                break;
            case 'image/jpg':
                ext = '.jpg';
                break;
            case 'image/png':
                ext = '.png';
                break;
            case 'image/gif':
                ext = '.gif';
                break;

            default:
                return false;
                break;
        }


        let sNewOriginalName = file.originalname;
        sNewOriginalName = sNewOriginalName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');
        sNewOriginalName = sNewOriginalName.slice(0, file.originalname.toLowerCase().indexOf(ext)) + Date.now() + ext;

        cb(null,  sNewOriginalName);
    }
});

function isMimeTypeImage(sFileName){
    if ((sFileName === 'image/jpeg')||(sFileName === 'image/jpg')||(sFileName==='image/png')||(sFileName==='image/png')) return true;

    return false;
}



const imageUpload = multer({storage: imageStorage});

router.post('/image',  imageUpload.single('file'), function (req, res, next) {

    console.log("@@@@@@@@@@@@@@ UPLOAD HANDLER");

    if (req.file && req.file.originalname) {
        console.log(`Received file ${req.file.originalname}`);

        let sFileURL = fileUploadURLPrefix+req.file.path.replace("public\\uploads\\images\\","/uploads/images/");
        let sThumbnail = '';
        if (isMimeTypeImage(req.file.mimetype) ) sThumbnail = sFileURL;

        res.send({ result:true, type: req.file.mimetype, name: req.file.originalname, url: sFileURL, thumbnail: sThumbnail });
    } else
        res.send({ result:false});

});






module.exports = router;