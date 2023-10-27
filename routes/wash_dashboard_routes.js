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

const washDashboardRouter = Router();

washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA,
  authenticationMiddleware,
  validator(washDashboardSchema, 'query'),
  washDashboarController
);
washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_WEEKLY_RECEIVE_VS_DELIVER,
  authenticationMiddleware,
  validator(weekReceiveVsDeliverySchema, 'query'),
  weekReceiveVsDeliveryController
);
washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA_STYLE_WISE_RECEIVE_VS_DELIVERY,
  authenticationMiddleware,
  validator(weekReceiveVsDeliverySchema, 'query'),
  weekReceiveVsDeliveryController
);

module.exports = washDashboardRouter;
