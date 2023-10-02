const { Router } = require('express');
const { API } = require("../util/constant");
const validator = require('../middlewares/validator_middleware');
const authenticationMiddleware = require('../middlewares/auth_middleware');

const { controller: createChallanController, schema: createChallanSchema } = require('../controllers/challan_approve/create_challan_controller');
const { controller: approveController, schema: approveSchema } = require('../controllers/challan_approve/approve_challan_controller');
const { controller: challanListController, schema: challanListSchema } = require('../controllers/challan_approve/get_challan_list_controller');
const { controller: challanSummaryController, schema: challanSummarySchema } = require('../controllers/challan_approve/get_challan_summary_controller');


const approvalRouter = Router();
approvalRouter.post(API.API_CONTEXT + API.CREATE_CHALLAN, validator(createChallanSchema), authenticationMiddleware, createChallanController);
approvalRouter.post(API.API_CONTEXT + API.APPROVE_CHALLAN, validator(approveSchema), authenticationMiddleware, approveController);
approvalRouter.post(API.API_CONTEXT + API.GET_CHALLAN_LIST, validator(challanListSchema), authenticationMiddleware, challanListController);
approvalRouter.post(API.API_CONTEXT + API.GET_CHALLAN_SUMMARY, validator(challanSummarySchema), authenticationMiddleware, challanSummaryController);

module.exports = approvalRouter;