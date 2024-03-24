const path = require('path');
const fs = require('fs');
const {Router} = require('express');
const multer = require('multer');
const { API } = require('../util/constant');
const uploadFilesRouter = Router();

const UPLOADED_DESTINATION = "public/uploaded";
const UPLOADED_DESTINATION_DOCUMENTS = "public/uploaded/documents";

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, UPLOADED_DESTINATION)
    },
    filename: (req, file, cb)=>{
        if(!fs.existsSync(UPLOADED_DESTINATION)){
            fs.mkdirSync("./public");
            fs.mkdirSync("./public/uploaded");
        }
        const ext = path.extname(file.originalname);
        const fileName = file.originalname;
        cb(null, fileName);
    }
    
})
const storage2 = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, UPLOADED_DESTINATION_DOCUMENTS)
    },
    filename: (req, file, cb)=>{
        if(!fs.existsSync(UPLOADED_DESTINATION_DOCUMENTS)){
            fs.mkdirSync("./public");
            fs.mkdirSync("./public/uploaded/documents");
        }
        const ext = path.extname(file.originalname);
        const fileName = file.originalname;
        cb(null, fileName);
    }
    
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000000
    },
    fileFilter: (req, file, cb)=>{
        if(file.mimetype==="image/jpg" || 
            file.mimetype==="image/png" || 
            file.mimetype==="application/pdf" ||
            file.mimetype==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.mimetype ==="image/jpeg"){
            cb(null, true);
        }else{
            cb(new Error("The image must be jpg or png or jpeg"));
        }
    }
});
const upload2 = multer({
    storage: storage2,
    limits: {
        fileSize: 100000000
    },
    fileFilter: (req, file, cb)=>{
        if(file.mimetype==="image/jpg" || 
            file.mimetype==="image/png" || 
            file.mimetype==="application/pdf" ||
            file.mimetype==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.mimetype ==="image/jpeg"){
            cb(null, true);
        }else{
            cb(new Error("The image must be jpg or png or jpeg"));
        }
    }
});

uploadFilesRouter.post(API.TMS_API_CONTEXT+"upload/image", upload.single("file"), (req,res)=>{
    const path = req.file.destination.replace("public/", "/") +"/"+ req.file.filename
    res.json({
        message: "Successfully uploaded",
        path: path
    });
})
uploadFilesRouter.post(API.TMS_API_CONTEXT+"upload/image/documents", upload2.single("file"), (req,res)=>{
    const path = req.file.destination.replace("public/", "/") +"/"+ req.file.filename
    res.json({
        message: "Successfully uploaded",
        path: path
    });
})

module.exports = uploadFilesRouter;