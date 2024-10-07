const {
    Router
}=require("express");

const authenticationMiddleware = require("../../middlewares/auth_middleware");
const validator=require("../../middlewares/validator_middleware")
const {
    API
}=require("../../util/constant");

const {
    controller: addUpdateCatMapController,
    schema: addUpdateCatMapSchema,
} = require("../../controllers/tender/user_cat_map/create_update/create_update_cat_map_controller");
const {
    controller: fetchCatListsController,
    schema: fetchCatListsSchema,
} = require("../../controllers/tender/user_cat_map/fetch/fetch_user_cat_map_controller");

const user_cat_map_routes=Router();

user_cat_map_routes.post(
    API.TMS_API_CONTEXT + API.TMS_USER_CAT_MAP,
    //authenticationMiddleware,
    validator(addUpdateCatMapSchema, 'body'),
    addUpdateCatMapController
);
user_cat_map_routes.get(
    API.TMS_API_CONTEXT + API.TMS_USER_CAT_LISTS,
    //authenticationMiddleware,
    validator(fetchCatListsSchema, 'query'),
    fetchCatListsController
);

module.exports=user_cat_map_routes;

