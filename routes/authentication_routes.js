const express = require("express");
const { API } = require("../util/constant");
const {controller: loginController, schema:loginSchema} = require('../controllers/authentication/login_controller');
const validator = require("../middlewares/validator_middleware");

const authenticationRouter = express.Router();
authenticationRouter.post(API.API_CONTEXT + API.LOGIN, validator(loginSchema), loginController);

module.exports = authenticationRouter;
