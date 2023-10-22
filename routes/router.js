const express = require("express");
const appRouter = express.Router();
const authenticationRouter = require("./authentication_routes");
const dashboardRouter=require('./dashboard');
const approvalRouter = require("./approval_routes");
const challanCheckingRouter = require('./checking_routes');
const uploadFilesRouter = require('./upload_files_routes');
const permissionRouter = require("./permission_routes");

appRouter.use(authenticationRouter);
appRouter.use(dashboardRouter);
appRouter.use(approvalRouter);
appRouter.use(challanCheckingRouter);
appRouter.use(uploadFilesRouter);
appRouter.use(permissionRouter);
module.exports = appRouter;
