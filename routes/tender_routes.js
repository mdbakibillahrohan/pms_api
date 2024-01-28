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
const {
  controller: getLastEntryTenderIdController,
  schema: getLastEntryTenderIdSchema,
} = require("../controllers/tender/get_last_entry_tender_id/get_last_tender_id_controller");
const {
  controller: getTenderListsController,
  schema: getTenderListsSchema,
} = require("../controllers/tender/get_tender_lists/get_tender_lists_controller");
const {
  controller: getTenderListsForPubliushController,
  schema: getTenderListsForPublishSchema,
} = require("../controllers/tender/get_tender_lists_for_publish/get_tender_lists_for_publish_controller");
const {
  controller: addNewTenderPublishController,
  schema: addNewTenderPublishSchema,
} = require("../controllers/tender/add_new_tender_publish/add_new_tender_publish_controller");
const {
  controller: publishTenderListsController,
  schema: publishTenderListsSchema,
} = require("../controllers/tender/get_publish_tender_lists/get_publish_tender_lists_controller");

const tender_routes = Router();

tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_LAST_TENDER_ID,
  authenticationMiddleware,
  validator(getLastEntryTenderIdSchema, 'query'),
  getLastEntryTenderIdController
);

tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_NEW_TENDER,
  authenticationMiddleware,
  validator(addNewTenderSchema, 'body'),
  addNewTenderController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_TENDER_LISTS,
  authenticationMiddleware,
  validator(getTenderListsSchema, 'query'),
  getTenderListsController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_TENDER_LISTS_FOR_PUBLISH,
  authenticationMiddleware,
  validator(getTenderListsForPublishSchema, 'query'),
  getTenderListsForPubliushController
);
tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_NEW_TENDER_PUBLISH,
  authenticationMiddleware,
  validator(addNewTenderPublishSchema, 'body'),
  addNewTenderPublishController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_TENDER_PUBLISH_LISTS,
  authenticationMiddleware,
  validator(publishTenderListsSchema, 'query'),
  publishTenderListsController
);


module.exports = tender_routes;