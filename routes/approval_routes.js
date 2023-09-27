const {Router} = require('express');
const { API } = require("../util/constant");
const approval_router = Router();


approval_router.get(API.API_CONTEXT+API.APPROVAL_GET, (req, res)=>{
    const io = req.io;
    io.emit("msg", "Prepared by complete");
    res.send("success");
})

module.exports = approval_router;