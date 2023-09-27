const express = require("express");
const menuRouter = express.Router();
const { API } = require("../util/constant");
const authMiddleware = require("../middlewares/auth_middleware");
const UserInfoController=require('../controllers/authentication/UserInfoController')
const {GetMenuController}=require('../controllers/UserMenu/get');
const {GetModuleController}=require('../controllers/UserMenu/getModule');
const {GetMenuControllerWithModuleId}=require('../controllers/UserMenu/getMenuWithModuleId')

menuRouter.get(
    API.API_CONTEXT + API.USERINFO,
    authMiddleware,
    UserInfoController
);
menuRouter.get(
    API.API_CONTEXT + API.GET_MODULE,
    authMiddleware,
    GetModuleController
);

menuRouter.get(
    API.API_CONTEXT + API.GET_MENU,
    authMiddleware,
    GetMenuControllerWithModuleId
);


menuRouter.get(
    API.API_CONTEXT + API.GET_MENU_ALL,
    authMiddleware,
    GetMenuController
);

module.exports=menuRouter


