const {Router} = require('express');
const { API } = require("../util/constant");
const validator = require('../middlewares/validator_middleware');
const authenticationMiddleware = require('../middlewares/auth_middleware');

const {controller: approve_controller, schema:approve_schema} = require('../controllers/challan_approve/approveController');
const {controller: createChallanController, schema:createChallanSchema} = require('../controllers/challan_approve/createChallanController');


const approval_router = Router();
approval_router.post(API.API_CONTEXT+API.CREATE_CHALLAN, validator(createChallanSchema), createChallanController);
approval_router.get(API.API_CONTEXT+API.APPROVAL_GET, validator(approve_schema, 'query'), authenticationMiddleware, approve_controller);

module.exports = approval_router;