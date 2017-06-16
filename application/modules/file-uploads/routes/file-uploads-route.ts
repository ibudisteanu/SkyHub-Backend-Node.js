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
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        // Mimetype stores the file type, set extensions according to filetype

        console.log("@@@@@@@@@@@@@@@@@@@", file.mimetype);
        switch (file.mimetype)
        {
            case 'image/jpeg':
                ext = '.jpeg';
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
                ext = '.docx';
                break;

            case 'application/rar':
                ext = '.rar';
                break;
        }

        cb(null, file.originalname.slice(0, 4) + Date.now() + ext);
    }
});

const upload = multer({storage: storage});
router.post('/topic-file',  upload.single('file'), function (req, res, next) {

    console.log("@@@@@@@@@@@@@@ UPLOAD HANDLER");
    console.log("@@@@@@@@@@@@@@ UPLOAD HANDLER");
    console.log("@@@@@@@@@@@@@@ UPLOAD HANDLER");
    console.log("@@@@@@@@@@@@@@ UPLOAD HANDLER");

    if (req.file && req.file.originalname) {
        console.log(`Received file ${req.file.originalname}`);
    }

    res.send({ responseText: req.file.path }); // You can send any response to the user here
});


module.exports = router;