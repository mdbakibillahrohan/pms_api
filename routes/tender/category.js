const {
    Router
}=require("express");
const authenticationMiddleware = require("../../middlewares/auth_middleware");
const validator=require("../../middlewares/validator_middleware")
const {
    API
}=require("../../util/constant");

const tender_category_routes=Router();

const {
    controller: addUpdateCatgoryController,
    schema: addUpdateCategorySchema,
} = require("../../controllers/tender/add_update_category/add_update_category_controller");
const {
    controller: deleteCategoryController,
    schema: deleteCategorySchema,
} = require("../../controllers/tender/delete_category/delete_category_controller");
const {
    controller: getCategoryController,
    schema: getCategorySchema,
} = require("../../controllers/tender/category/fetch/fetch_category_controller");
const {
    controller: fetchCategoryWithIdController,
    schema: fetchCategoryWithIdSchema,
} = require("../../controllers/tender/category/get_category_with_id/get_category_with_id_controller");


tender_category_routes.post(
    API.TMS_API_CONTEXT + API.TMS_ADD_NEW_CATEGORY,
    //authenticationMiddleware,
    validator(addUpdateCategorySchema, 'body'),
    addUpdateCatgoryController
);
tender_category_routes.get(
    API.TMS_API_CONTEXT + API.TMS_FETCH_CATEGORY,
    //authenticationMiddleware,
    validator(getCategorySchema, 'query'),
    getCategoryController
);
tender_category_routes.get(
    API.TMS_API_CONTEXT + API.TMS_FETCH_CATEGORY_BY_ID,
    //authenticationMiddleware,
    validator(fetchCategoryWithIdSchema, 'query'),
    fetchCategoryWithIdController
);
tender_category_routes.post(
    API.TMS_API_CONTEXT + API.TMS_DELETE_CATEGORY,
    //authenticationMiddleware,
    validator(deleteCategorySchema, 'body'),
    deleteCategoryController
);

module.exports=tender_category_routes

