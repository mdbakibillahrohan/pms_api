const { 
    Router 
} = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { 
    API 
} = require("../util/constant");


const {
  controller: getTenderListsController,
  schema: getTenderListsSchema,
} = require("../controllers/tender_public/get_tender_lists/get_tender_lists_controller");
const {
  controller: getTenderListsDetailsController,
  schema: getTenderDetailsSchema,
} = require("../controllers/tender_public/get_tender_details/get_tender_lists_details_controller");


const tender_public_routes = Router();


tender_public_routes.get(
  API.TMS_API_CONTEXT + API.TMS_PUBLIC_LISTS,
  //authenticationMiddleware,
  validator(getTenderListsSchema, 'query'),
  getTenderListsController
);
tender_public_routes.get(
  API.TMS_API_CONTEXT + API.TMS_PUBLIC_LISTS_DETAILS,
  //authenticationMiddleware,
  validator(getTenderDetailsSchema, 'query'),
  getTenderListsDetailsController
);


module.exports = tender_public_routes;