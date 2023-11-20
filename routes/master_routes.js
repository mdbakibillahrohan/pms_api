const { Router } = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: getBuyerController,
  schema: getBuyerSchema,
} = require("../controllers/master/get_buyer_controller");
const {
  controller: getStylesController,
  schema: getStylesSchema,
} = require("../controllers/master/get_styles_controller");
const {
  controller: getUnitListController,
  schema: getUnitListSchema,
} = require("../controllers/master/get_unit_list_controller");
const {
  controller: getColorController,
  schema: getColorSchema,
} = require("../controllers/master/get_color_controller");

const masterRouter = Router();

masterRouter.get(
  API.API_CONTEXT + API.MASTER_GET_BUYER,
  //authenticationMiddleware,
  validator(getBuyerSchema),
  getBuyerController
);
masterRouter.get(
  API.API_CONTEXT + API.MASTER_GET_STYLES,
  //authenticationMiddleware,
  validator(getStylesSchema),
  getStylesController
);
masterRouter.get(
  API.API_CONTEXT + API.MASTER_GET_UNIT_LIST,
  //authenticationMiddleware,
  validator(getUnitListSchema),
  getUnitListController
);
masterRouter.get(
  API.API_CONTEXT + API.MASTER_GET_COLOR_LISTS,
  //authenticationMiddleware,
  validator(getColorSchema),
  getColorController
);

module.exports = masterRouter;
