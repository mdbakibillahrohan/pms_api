const { Router } = require("express");
const { API } = require("../util/constant");
const validator = require("../middlewares/validator_middleware");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const checkingAuthorizationMiddleware = require("../middlewares/checking_authorization_middleware");

const {
  controller: challanCheckingController,
  schema: challanCheckingSchema,
} = require("../controllers/challan_checking/challan_checking_controller");
const {
  controller: challanCheckingListController,
  schema: challanCheckingListSchema,
} = require("../controllers/challan_checking/challan_checking_list_controller");
const {
  controller: challanCheckingSummaryController,
  schema: challanCheckingSummarySchema,
} = require("../controllers/challan_checking/challan_checking_summary_controller");

const checkingRouter = Router();
checkingRouter.post(
  API.API_CONTEXT + API.CHALLAN_CHECKING,
  validator(challanCheckingSchema),
  authenticationMiddleware,
  //checkingAuthorizationMiddleware,
  challanCheckingController
);
checkingRouter.post(
  API.API_CONTEXT + API.CHALLAN_CHEKING_LIST,
  validator(challanCheckingListSchema),
  authenticationMiddleware,
  //checkingAuthorizationMiddleware,
  challanCheckingListController
);
checkingRouter.post(
  API.API_CONTEXT + API.CHALLAN_CHEKING_SUMMARY,
  validator(challanCheckingSummarySchema),
  authenticationMiddleware,
  //checkingAuthorizationMiddleware,
  challanCheckingSummaryController
);

module.exports = checkingRouter;
