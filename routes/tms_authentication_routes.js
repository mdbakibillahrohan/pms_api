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
  controller: tmsLoginController,
  schema: tmsLoginSchema,
} = require("../controllers/authentication/tms_login_controller");

const tmsAuthenticationRoutes = Router();

tmsAuthenticationRoutes.post(
  API.TMS_API_CONTEXT + API.TMS_REGISTRATION,
  //authenticationMiddleware,
  validator(tms_registration_controller_schema, 'body'),
  tms_registration_controller
);
tmsAuthenticationRoutes.post(
  API.TMS_API_CONTEXT + API.TMS_LOGIN,
  //authenticationMiddleware,
  validator(tmsLoginSchema, 'body'),
  tmsLoginController
);

module.exports = tmsAuthenticationRoutes;