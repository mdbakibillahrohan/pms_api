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
const {
  controller: getTenderUserDetailsController,
  schema: getTenderUserDetailsSchema,
} = require("../controllers/tender_public/get_tender_user_details/get_tender_user_details_controller");
const {
  controller: addNewBiddingController,
  schema: addNewBiddingSchema,
} = require("../controllers/tender_public/create_new_bidding/create_new_bidding_controller");


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
tender_public_routes.get(
  API.TMS_API_CONTEXT + API.TMS_TENDER_USER_DETAILS,
  authenticationMiddleware,
  validator(getTenderUserDetailsSchema, 'query'),
  getTenderUserDetailsController
);
tender_public_routes.post(
  API.TMS_API_CONTEXT + API.TMS_NEW_TENDER_BID,
  authenticationMiddleware,
  validator(addNewBiddingSchema, 'body'),
  addNewBiddingController
);


module.exports = tender_public_routes;