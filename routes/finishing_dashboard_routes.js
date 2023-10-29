const { Router } = require("express");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: totalReceiveController,
  schema: totalReceiveSchema,
} = require("../controllers/finishing_dashboard/total_receive_controller");


const finishingDashboardRouter = Router();


finishingDashboardRouter.get(
  API.API_CONTEXT + API.FINISHING_DASHBOARD_DATA_TOTAL_RECEIVE_GMT,
  validator(totalReceiveSchema, 'query'),
  totalReceiveController
);



module.exports = finishingDashboardRouter;
