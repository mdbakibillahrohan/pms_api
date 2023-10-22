const { Router } = require("express");
const authenticationMiddleware = require("../middlewares/auth_middleware");
const validator = require("../middlewares/validator_middleware");
const { API } = require("../util/constant");

const {
  controller: userPermissionListController,
  schema: userPermissionListSchema,
} = require("../controllers/user_permission/get_user_permission_list_controller");

const permissionRouter = Router();

permissionRouter.post(
  API.API_CONTEXT + API.CHALLAN_USER_PERMISSION_LIST,
  authenticationMiddleware,
  validator(userPermissionListSchema),
  userPermissionListController
);

module.exports = permissionRouter;
