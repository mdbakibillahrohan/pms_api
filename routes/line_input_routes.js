const { Router } = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: getCuttingDetailsController,
  schema: getCuttingDetailsSchema,
} = require("../controllers/line_input/get_cutting_details_with_id_controller");
const {
  controller: getAddNewLineController,
  schema: getAddNewLineSchema,
} = require("../controllers/line_input/add_new_line_input_controller");
const {
  controller: getLineInputListsController,
  schema: getlineInputListsSchema,
} = require("../controllers/line_input/get_input_line_lists_controller");


const lineInputRouter = Router();

lineInputRouter.get(
  API.API_CONTEXT + API.GET_CUTTING_DETAILS_WITH_ID,
  //authenticationMiddleware,
  validator(getCuttingDetailsSchema,'query'),
  getCuttingDetailsController
);
lineInputRouter.post(
  API.API_CONTEXT + API.GET_CUTTING_LINE_ENTRY,
  //authenticationMiddleware,
  validator(getAddNewLineSchema),
  getAddNewLineController
);
lineInputRouter.get(
  API.API_CONTEXT + API.GET_CUTTING_LINE_LISTS,
  //authenticationMiddleware,
  validator(getlineInputListsSchema,'query'),
  getLineInputListsController
);


module.exports = lineInputRouter;
