const { Router } = require('express');
const { API } = require("../util/constant");
const validator = require('../middlewares/validator_middleware');
const authenticationMiddleware = require('../middlewares/auth_middleware');


const { controller: challanCheckingController, schema: challanCheckingSchema } = require('../controllers/challan_checking/challan_checking_controller');

const checkInRouter = Router();
checkInRouter.post(API.API_CONTEXT + API.CHALLAN_CHECKING, validator(challanCheckingSchema), authenticationMiddleware, challanCheckingController);

module.exports = checkInRouter; 