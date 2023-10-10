const express = require("express");
const appRouter = express.Router();
const authenticationRouter = require("./authentication_routes");
const dashboardRouter=require('./dashboard');
const approvalRouter = require("./approval_routes");
const challanCheckingRouter = require('./checking_routes');

appRouter.use(authenticationRouter);
appRouter.use(dashboardRouter);
appRouter.use(approvalRouter);
appRouter.use(challanCheckingRouter);
module.exports = appRouter;
