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

const masterRouter = Router();

masterRouter.get(
  API.API_CONTEXT + API.MASTER_GET_BUYER,
  authenticationMiddleware,
  validator(getBuyerSchema),
  getBuyerController
);
masterRouter.get(
  API.API_CONTEXT + API.MASTER_GET_STYLES,
  authenticationMiddleware,
  validator(getStylesSchema),
  getStylesController
);

module.exports = masterRouter;
