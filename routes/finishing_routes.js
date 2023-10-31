const { Router } = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: styleWiseTargetEntryController,
  schema: styleWiseTargetEntrySchema,
} = require("../controllers/finishing/style_wise_target_entry_controller");
const {
  controller: styleWiseTargetListController,
  schema: styleWiseTargetListSchema,
} = require("../controllers/finishing/style_wise_target_list_controller");

const finishingRouter = Router();

finishingRouter.post(
  API.API_CONTEXT + API.FINISHING_STYLE_WISE_TARGET_ENTRY,
  //authenticationMiddleware,
  validator(styleWiseTargetEntrySchema),
  styleWiseTargetEntryController
);
finishingRouter.get(
  API.API_CONTEXT + API.FINISHING_STYLE_WISE_TARGET_LIST,
  //authenticationMiddleware,
  validator(styleWiseTargetListSchema),
  styleWiseTargetListController
);

module.exports = finishingRouter;
