const { Router } = require("express");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: totalReceiveController,
  schema: totalReceiveSchema,
} = require("../controllers/finishing_dashboard/total_receive_controller");
const {
  controller: totalProductionController,
  schema: totalProductionSchema,
} = require("../controllers/finishing_dashboard/total_production_controller");
const {
  controller: thisMonthTotalProductionController,
  schema: thisMonthTotalProductionSchema,
} = require("../controllers/finishing_dashboard/this_moth_total_production_controller");
const {
  controller: totalRejectionPercentageController,
  schema: totalRejectionPercentageSchema,
} = require("../controllers/finishing_dashboard/total_rejection_percentage_controller");
const {
  controller: finishingDashboardWipController,
  schema: finishingDashboardWipSchema,
} = require("../controllers/finishing_dashboard/finishing_dashboard_wip_controller");
const {
  controller: weeklyReceiveVsProductionController,
  schema: weeklyReceiveVsProductionSchema,
} = require("../controllers/finishing_dashboard/weekly_receive_vs_production_controller");



const finishingDashboardRouter = Router();


finishingDashboardRouter.get(
  API.API_CONTEXT + API.FINISHING_DASHBOARD_DATA_TOTAL_RECEIVE_GMT,
  validator(totalReceiveSchema, 'query'),
  totalReceiveController
);
finishingDashboardRouter.get(
  API.API_CONTEXT + API.FINISHING_DASHBOARD_DATA_TOTAL_PRODUCTION,
  validator(totalProductionSchema, 'query'),
  totalProductionController
);
finishingDashboardRouter.get(
  API.API_CONTEXT + API.FINISHING_DASHBOARD_DATA_THIS_MONTH_TOTAL_PRODUCTION,
  validator(thisMonthTotalProductionSchema, 'query'),
  thisMonthTotalProductionController
);
finishingDashboardRouter.get(
  API.API_CONTEXT + API.FINISHING_DASHBOARD_DATA_TOTAL_REJECTION_PERCENTAGE,
  validator(totalRejectionPercentageSchema, 'query'),
  totalRejectionPercentageController
);
finishingDashboardRouter.get(
  API.API_CONTEXT + API.FINISHING_DASHBOARD_DATA_WIP,
  validator(finishingDashboardWipSchema, 'query'),
  finishingDashboardWipController
);
finishingDashboardRouter.get(
  API.API_CONTEXT + API.FINISHING_DASHBOARD_DATA_WEEKLY_RECEIVE_VS_PRODUCTION,
  validator(weeklyReceiveVsProductionSchema, 'query'),
  weeklyReceiveVsProductionController
);
// finishingDashboardRouter.get(
//   API.API_CONTEXT + API.FINISHING_DASHBOARD_DATA_TOTAL_DELIVERY,
//   validator(totalDeliverySchema, 'query'),
//   totalDeliveryController
// );



module.exports = finishingDashboardRouter;
