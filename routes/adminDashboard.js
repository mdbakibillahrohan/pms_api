const express = require("express");
const adminDashboardRouter = express.Router();
const { API } = require("../util/constant");
const authMiddleware = require("../middlewares/auth_middleware");
const {GetTreeWithUserIdController}=require('../controllers/AdminDashboard/getTreeWithUserId')
const GetAdminInfoController=require('../controllers/AdminDashboard/GetAdminInfoController')
const GetAdminUnitController=require('../controllers/AdminDashboard/GetAdminUnitController')


adminDashboardRouter.get(
    API.API_CONTEXT + API.GET_TREE_WITH_USER_ID,
    authMiddleware,
    GetTreeWithUserIdController
);

adminDashboardRouter.get(
    API.API_CONTEXT + API.GET_ADMIN_INFO,
    authMiddleware,
    GetAdminInfoController
);

adminDashboardRouter.get(
    API.API_CONTEXT + API.GET_ADMIN_UNIT,
    authMiddleware,
    GetAdminUnitController
);



module.exports=adminDashboardRouter


