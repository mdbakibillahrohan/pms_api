const { Router } = require("express");
const { API } = require("../../util/constant");
const validator = require("../../middlewares/validator_middleware");

const {
  controller: returnWashChallanCreateController,
  schema: returnWashChallanCreateSchema,
} = require("../../controllers/return_challan/wash/return_wash_challan_create_controller");


const returnWashApprovalRouter = Router();
returnWashApprovalRouter.post(
  API.API_CONTEXT + API.RETURN_WASH_CHALLAN_CREATE,
  validator(returnWashChallanCreateSchema),
  returnWashChallanCreateController
);



module.exports = returnWashApprovalRouter;
