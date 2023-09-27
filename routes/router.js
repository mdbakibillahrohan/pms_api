const express = require("express");
const appRouter = express.Router();

const authenticationRouter = require("./authentication");
const menuRouter=require('./menu')
const dashboardRouter=require('./dashboard');
const adminDashboardRouter=require('./adminDashboard');
const approval_router = require("./approval_routes");

appRouter.use(authenticationRouter);
// appRouter.use(menuRouter);
appRouter.use(dashboardRouter);
// appRouter.use(adminDashboardRouter);
appRouter.use(approval_router);
module.exports = appRouter;
