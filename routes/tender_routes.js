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
  controller: updateOnGoingTenderController,
  schema: updateOnGoingTenderShema,
} = require("../controllers/tender/update_on_going_tender/add_new_tender_controller");
const {
  controller: updateNotPublishTenderController,
  schema: updateNotPublishTenderShema,
} = require("../controllers/tender/update_not_publish_tender/update_not_publish_tender_controller");
const {
  controller: getTenderDetailsController,
  schema: getTenderDetailsSchema,
} = require("../controllers/tender/get_tender_details_with_TenderNo/get_tender_details_with_TenderNo_controller");
const {
  controller: getAllTenderItemsController,
  schema: getAllTenderItemsSchema,
} = require("../controllers/tender/get_all_tender_items/get_all_tender_items_controller");
const {
  controller: getTenderItemsSearchController,
  schema: getTenderItemSearchSchema,
} = require("../controllers/tender/get_item_price_date/get_item_price_date_controller");
const {
  controller: getLastEntryTenderIdController,
  schema: getLastEntryTenderIdSchema,
} = require("../controllers/tender/get_last_entry_tender_id/get_last_tender_id_controller");
const {
  controller: getGradeListsConrtroller,
  schema: getGradeListsShema,
} = require("../controllers/tender/get_grade_lists/get_grade_lists_controller");
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
const {
  controller: publishTenderListsDetailsWithIdController,
  schema: publishTenderListsDetailsWithIdSchema,
} = require("../controllers/tender/get_tender_publish_with_id/get_tender_publish_with_id_controller");
const {
  controller: getBiddingListsController,
  schema: getBiddingListsSchema,
} = require("../controllers/tender/get_bidding_lists/get_bidding_lists_controller");
const {
  controller: getBiddingListsDetailsController,
  schema: getBiddingListsDetailsSchema,
} = require("../controllers/tender/get_bidding_lists_report/get_bidding_lists_report_controller");
const {
  controller: getBiddingDetailsListsController,
  schema: getBiddingDetailsListsSchema,
} = require("../controllers/tender/get_bidding_lists_details/get_bidding_lists_details_controller");
const {
  controller: addNewTimerLogController,
  schema: addNewTimerLogSchema,
} = require("../controllers/tender/add_new_timer/add_new_timer_controller");
const {
  controller: getTenderUsersController,
  schema: getTenderUsersSchema,
} = require("../controllers/tender/get_tender_users/get_tender_users_controller");
const {
  controller: updateTenderUserStatusController,
  schema: updateTenderUserStatusSchema,
} = require("../controllers/tender/tender_user_approved_reject/tender_user_approved_rejected_controller");
const {
  controller: deleteTenderUserController,
  schema: deleteTenderUserSchema,
} = require("../controllers/tender/tender_user_delete/tender_user_delete_controller");
const {
  controller: getTenderUserListsAllController,
  schema: getTenderUserListsAllSchema,
} = require("../controllers/tender/get_tender_user_lists/get_tender_user_lists_controller");
const {
  controller: get_approver_type_lists_controller,
  schema: get_approver_type_lists_schema,
} = require("../controllers/tender/get_approver_type_lists/get_approver_type_lists_controller");
const {
  controller: get_erp_user_lists_controller,
  schema: get_erp_user_lists_schema,
} = require("../controllers/tender/get_erp_user_lists/get_erp_user_lists_controller");
const {
  controller: get_approver_type_lists_by_id_controller,
  schema: get_approver_type_lists_by_id_schema,
} = require("../controllers/tender/get_approver_lists_by_type/get_approver_lists_by_type_controller");

const tender_routes = Router();

tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_LAST_TENDER_ID,
  authenticationMiddleware,
  validator(getLastEntryTenderIdSchema, 'query'),
  getLastEntryTenderIdController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GRADE_LISTS,
  //authenticationMiddleware,
  validator(getGradeListsShema, 'query'),
  getGradeListsConrtroller
);

tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_TENDER_ITEM_LISTS,
  //authenticationMiddleware,
  validator(getAllTenderItemsSchema, 'query'),
  getAllTenderItemsController
);
tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_TENDER_ITEM_LISTS_PRICE_DATES,
  //authenticationMiddleware,
  validator(getTenderItemSearchSchema, 'body'),
  getTenderItemsSearchController
);

tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_NEW_TENDER,
  //authenticationMiddleware,
  validator(addNewTenderSchema, 'body'),
  addNewTenderController
);
tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_ON_GOING_UPDATE_TENDER,
  //authenticationMiddleware,
  validator(updateOnGoingTenderShema, 'body'),
  updateOnGoingTenderController
);
tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_NOT_PUBLISHED_UPDATE_TENDER,
  //authenticationMiddleware,
  validator(updateNotPublishTenderShema, 'body'),
  updateNotPublishTenderController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_TENDER_DETAILS,
  //authenticationMiddleware,
  validator(getTenderDetailsSchema, 'query'),
  getTenderDetailsController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_TENDER_LISTS,
  //authenticationMiddleware,
  validator(getTenderListsSchema, 'query'),
  getTenderListsController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_TENDER_LISTS_FOR_PUBLISH,
  //authenticationMiddleware,
  validator(getTenderListsForPublishSchema, 'query'),
  getTenderListsForPubliushController
);
tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_NEW_TENDER_PUBLISH,
  //authenticationMiddleware,
  validator(addNewTenderPublishSchema, 'body'),
  addNewTenderPublishController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_TENDER_PUBLISH_LISTS,
  //authenticationMiddleware,
  validator(publishTenderListsSchema, 'query'),
  publishTenderListsController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TM_GET_PUBLISH_TENDER_WITH_ID,
  //authenticationMiddleware,
  validator(publishTenderListsDetailsWithIdSchema, 'query'),
  publishTenderListsDetailsWithIdController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_BIDDING_LISTS,
  //authenticationMiddleware,
  validator(getBiddingListsSchema, 'query'),
  getBiddingListsController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_BIDDING_LISTS_DETAILS,
  //authenticationMiddleware,
  validator(getBiddingListsDetailsSchema, 'query'),
  getBiddingListsDetailsController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_BIDDING_DETAILS_LISTS,
  //authenticationMiddleware,
  validator(getBiddingDetailsListsSchema, 'query'),
  getBiddingDetailsListsController
);
tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_ADD_NEW_TIMER,
  //authenticationMiddleware,
  validator(addNewTimerLogSchema, 'body'),
  addNewTimerLogController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_TENDER_USER_LISTS,
  //authenticationMiddleware,
  validator(getTenderUsersSchema, 'query'),
  getTenderUsersController
);
tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_UPDATE_TENDER_USER,
  //authenticationMiddleware,
  validator(updateTenderUserStatusSchema, 'body'),
  updateTenderUserStatusController
);
tender_routes.post(
  API.TMS_API_CONTEXT + API.TMS_DELETE_TENDER_USER,
  //authenticationMiddleware,
  validator(deleteTenderUserSchema, 'body'),
  deleteTenderUserController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_TENDER_USER_LISTS_ALL,
  //authenticationMiddleware,
  validator(getTenderUserListsAllSchema, 'body'),
  getTenderUserListsAllController
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_APPROVER_TYPE_LISTS,
  //authenticationMiddleware,
  validator(get_approver_type_lists_schema, 'query'),
  get_approver_type_lists_controller
);
// tender_routes.get(
//   API.TMS_API_CONTEXT + API.TMS_GET_APPROVER_TYPE_LISTS,
//   //authenticationMiddleware,
//   validator(get_approver_type_lists_schema, 'query'),
//   get_approver_type_lists_controller
// );
// tender_routes.get(
//   API.TMS_API_CONTEXT + API.TMS_GET_ERP_USER_LISTS,
//   //authenticationMiddleware,
//   validator(get_erp_user_lists_schema, 'query'),
//   get_erp_user_lists_controller
// );
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_ERP_USER_LISTS,
  //authenticationMiddleware,
  validator(get_erp_user_lists_schema, 'query'),
  get_erp_user_lists_controller
);
tender_routes.get(
  API.TMS_API_CONTEXT + API.TMS_GET_APPROVER_LISTS_BY_TYPE_ID,
  //authenticationMiddleware,
  validator(get_approver_type_lists_by_id_schema, 'query'),
  get_approver_type_lists_by_id_controller
);

module.exports = tender_routes;