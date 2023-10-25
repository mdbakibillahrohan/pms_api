const { Router } = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: washDashboarController,
  schema: washDashboardSchema,
} = require("../controllers/wash_dashboard/wash_dashboard_controller");

const washDashboardRouter = Router();

washDashboardRouter.get(
  API.API_CONTEXT + API.WASH_DASHBORD_DATA,
  authenticationMiddleware,
  validator(washDashboardSchema, 'query'),
  washDashboarController
);

module.exports = washDashboardRouter;
