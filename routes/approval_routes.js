const {Router} = require('express');
const { API } = require("../util/constant");
const validator = require('../middlewares/validator_middleware');
const {controller: approve_controller, schema:approve_schema} = require('../controllers/ChallanApproval/approve_controller');


const approval_router = Router();
approval_router.get(API.API_CONTEXT+API.APPROVAL_GET, validator(approve_schema, 'querys'), approve_controller);

module.exports = approval_router;