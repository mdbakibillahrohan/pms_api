const { Router } = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: unidentifyProductsEntryController,
  schema: unidentifyProductsSchema,
} = require("../controllers/washing/unidentify_products/unidentify_products_entry_controller");
const {
  controller: unidentifyProductsListController,
  schema: unidentifyProductsListSchema,
} = require("../controllers/washing/unidentify_products/unidentify_products_list_controller");

const washingRouter = Router();

washingRouter.post(
  API.API_CONTEXT + API.UNIDENTIFIY_PRODUCTS_ENTRY,
  //authenticationMiddleware,
  validator(unidentifyProductsSchema),
  unidentifyProductsEntryController
);
washingRouter.get(
  API.API_CONTEXT + API.UNIDENTIFIY_PRODUCTS_LIST,
  //authenticationMiddleware,
  validator(unidentifyProductsListSchema),
  unidentifyProductsListController
);
// washingRouter.get(
//   API.API_CONTEXT + API.FINISHING_STYLE_WISE_TARGET_LIST,
//   //authenticationMiddleware,
//   validator(styleWiseTargetListSchema),
//   styleWiseTargetListController
// );

module.exports = washingRouter;
