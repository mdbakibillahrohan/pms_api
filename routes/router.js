const express = require("express");
const appRouter = express.Router();
const authenticationRouter = require("./authentication_routes");
const dashboardRouter=require('./dashboard');
const approval_router = require("./approval_routes");

appRouter.use(authenticationRouter);
appRouter.use(dashboardRouter);
appRouter.use(approval_router);
module.exports = appRouter;
