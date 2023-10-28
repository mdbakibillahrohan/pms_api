const { Router } = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: washDashboarController,
  schema: washDashboardSchema,
} = require("../controllers/wash_dashboard/wash_dashboard_controller");
const {
  controller: weekReceiveVsDeliveryController,
  schema: weekReceiveVsDeliverySchema,
} = require("../controllers/wash_dashboard/weekly_receive_vs_delivery_controller");
const {
  controller: styleWiseReceiveVsDeliveryController,
  schema: styleWiseReceiveVsDeliverySchema,
} = require("../controllers/wash_dashboard/style_wise_receive_vs_delivery_controller");
const {
  controller: totalReceivedController,
  schema: totalReceivedSchema,
} = require("../controllers/wash_dashboard/total_received_gmt_controller");
const {
  controller: totalDeliveryController,
  schema: totalDeliverySchema,
} = require("../controllers/wash_dashboard/total_delivery_gmt_controller");
const {
  controller: totalProductionController,
  schema: totalProductionSchema,
} = require("../controllers/wash_dashboard/total_production_controller");
const {
  controller: thisMonthTotalProductionController,
  schema: thisMonthTotalProductionSchema,
} = require("../controllers/wash_dashboard/this_month_total_production_controller");
const {
  controller: totalRejectionPercentageController,
  schema: totalRejectionPercentageSchema,
} = require("../controllers/wash_dashboard/total_reject_percentage_controller");
const {
  controller: wipController,
  schema: wipSchema,
} = require("../controllers/wash_dashboard/wip_controller");

const washDashboardRouter = Router();

washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA,
  validator(washDashboardSchema, 'query'),
  washDashboarController
);

washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_TOTAL_RECEIVE_GMT,
  validator(totalReceivedSchema, 'query'),
  totalReceivedController
);


washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_TOTAL_DELIVERY,
  validator(totalDeliverySchema, 'query'),
  totalDeliveryController
);


washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_TOTAL_PRODUCTION,
  validator(totalProductionSchema, 'query'),
  totalProductionController
);


washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_THIS_MONTH_TOTAL_PRODUCTION,
  validator(thisMonthTotalProductionSchema, 'query'),
  thisMonthTotalProductionController
);


washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_TOTAL_REJECTION_PERCENTAGE,
  validator(totalRejectionPercentageSchema, 'query'),
  totalRejectionPercentageController
);


washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_WIP,
  validator(wipSchema, 'query'),
  wipController
);


washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_WEEKLY_RECEIVE_VS_DELIVER,
  validator(weekReceiveVsDeliverySchema, 'query'),
  weekReceiveVsDeliveryController
);
washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_STYLE_WISE_RECEIVE_VS_DELIVERY,
  validator(styleWiseReceiveVsDeliverySchema, 'query'),
  styleWiseReceiveVsDeliveryController
);

module.exports = washDashboardRouter;
