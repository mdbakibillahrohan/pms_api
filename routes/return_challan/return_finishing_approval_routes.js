const { Router } = require("express");
const { API } = require("../../util/constant");
const validator = require("../../middlewares/validator_middleware");

const {
  controller: returnFinishingChallanCreateController,
  schema: returnFinishingChallanCreateSchema,
} = require("../../controllers/return_challan/finishing/return_finishing_challan_create_controller");
const {
  controller: returnFinishingChallanListController,
  schema: returnFinishingChallanListSchema,
} = require("../../controllers/return_challan/finishing/return_finishing_challan_list_controller");


const returnFinishingApprovalRouter = Router();
returnFinishingApprovalRouter.post(
  API.API_CONTEXT + API.RETURN_FINISHING_CHALLAN_CREATE,
  validator(returnFinishingChallanCreateSchema),
  returnFinishingChallanCreateController
);
returnFinishingApprovalRouter.get(
  API.API_CONTEXT + API.GET_RETURN_FINISHING_CHALLAN_LIST,
  validator(returnFinishingChallanListSchema),
  returnFinishingChallanListController
);

module.exports = returnFinishingApprovalRouter;
