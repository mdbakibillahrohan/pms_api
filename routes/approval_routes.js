const {Router} = require('express');
const { API } = require("../util/constant");
const validator = require('../middlewares/validator_middleware');
const authenticationMiddleware = require('../middlewares/auth_middleware');

const {controller: createChallanController, schema:createChallanSchema} = require('../controllers/challan_approve/create_challan_controller');
const {controller: approveController, schema:approveSchema} = require('../controllers/challan_approve/approve_challan_controller');


const approval_router = Router();
approval_router.post(API.API_CONTEXT+API.CREATE_CHALLAN, validator(createChallanSchema), authenticationMiddleware, createChallanController);
approval_router.post(API.API_CONTEXT+API.APPROVE_CHALLAN, validator(approveSchema), authenticationMiddleware, approveController);
approval_router.post(API.API_CONTEXT+API.GET_CHALLAN_LIST, validator(approveSchema), authenticationMiddleware, approveController);

module.exports = approval_router;