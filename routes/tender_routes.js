const { 
    Router 
} = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { 
    API 
} = require("../util/constant");

const {
  controller: tms_registration_controller,
  schema: tms_registration_controller_schema,
} = require("../controllers/authentication/tms_registration_controller");
const {
  controller: addNewTenderController,
  schema: addNewTenderSchema,
} = require("../controllers/tender/add_new_tender/add_new_tender_controller");

const tender_routes = Router();

tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_NEW_TENDER,
  authenticationMiddleware,
  validator(addNewTenderSchema, 'body'),
  addNewTenderController
);

module.exports = tender_routes;