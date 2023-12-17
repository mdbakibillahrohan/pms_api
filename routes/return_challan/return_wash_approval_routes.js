const { Router } = require("express");
const { API } = require("../../util/constant");
const validator = require("../../middlewares/validator_middleware");

const {
  controller: returnWashChallanCreateController,
  schema: returnWashChallanCreateSchema,
} = require("../../controllers/return_challan/wash/return_wash_challan_create_controller");
const {
  controller: returnWashChallanListController,
  schema: returnWashChallanListSchema,
} = require("../../controllers/return_challan/wash/return_wash_challan_list_controller");


const returnWashApprovalRouter = Router();
returnWashApprovalRouter.post(
  API.API_CONTEXT + API.RETURN_WASH_CHALLAN_CREATE,
  validator(returnWashChallanCreateSchema),
  returnWashChallanCreateController
);
returnWashApprovalRouter.get(
  API.API_CONTEXT + API.GET_RETURN_WASH_CHALLAN_LIST,
  validator(returnWashChallanListSchema),
  returnWashChallanListController
);


module.exports = returnWashApprovalRouter;
