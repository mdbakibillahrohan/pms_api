const { Router } = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: cuttingToChallanReportController,
  schema: cuttingToChallanReportSchema,
} = require("../controllers/reports/cutting_to_challan_controller");

const reportRouter = Router();

reportRouter.get(
  API.API_CONTEXT + API.REPORT_CUTTING_TO_FINISHING,
  //authenticationMiddleware,
  validator(cuttingToChallanReportSchema, 'query'),
  cuttingToChallanReportController
);

module.exports = reportRouter;
