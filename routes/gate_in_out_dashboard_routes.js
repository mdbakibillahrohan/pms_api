const { Router } = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: getInOutDashboardController,
  schema: getInOutDashboardSchema,
} = require("../controllers/gate_in_out_dashboard/gate_in_out_dashboard_controller");

const gateInOutDashboardRouter = Router();

gateInOutDashboardRouter.post(
  API.API_CONTEXT + API.GATE_IN_OUT_DASHBOARD,
  authenticationMiddleware,
  validator(getInOutDashboardSchema),
  getInOutDashboardController
);

module.exports = gateInOutDashboardRouter;
