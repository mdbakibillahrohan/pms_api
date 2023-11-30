const express = require("express");
const appRouter = express.Router();
const authenticationRouter = require("./authentication_routes");
const dashboardRouter=require('./dashboard');
const approvalRouter = require("./approval_routes");
const challanCheckingRouter = require('./checking_routes');
const uploadFilesRouter = require('./upload_files_routes');
const permissionRouter = require("./permission_routes");
const washDashboardRouter = require("./wash_dashboard_routes");
const gateInOutDashboardRouter = require("./gate_in_out_dashboard_routes");
const finishingDashboardRouter = require("./finishing_dashboard_routes");
const masterRouter = require("./master_routes");
const finishingRouter = require("./finishing_routes");
const washingRouter = require("./washing_routes");
const reportRouter = require("./report_routes");
const returnWashApprovalRouter = require("./return_challan/return_wash_approval_routes");
const lineInputRouter = require("./line_input_routes");



appRouter.use(authenticationRouter);
appRouter.use(dashboardRouter);
appRouter.use(lineInputRouter)
appRouter.use(approvalRouter);
appRouter.use(challanCheckingRouter);
appRouter.use(uploadFilesRouter);
appRouter.use(permissionRouter);
appRouter.use(washDashboardRouter);
appRouter.use(gateInOutDashboardRouter);
appRouter.use(finishingDashboardRouter);
appRouter.use(masterRouter);
appRouter.use(finishingRouter);
appRouter.use(washingRouter);
appRouter.use(reportRouter);
appRouter.use(returnWashApprovalRouter);
module.exports = appRouter;
