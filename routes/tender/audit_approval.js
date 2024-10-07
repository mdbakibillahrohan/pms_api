const {Router}=require('express');
const {API}=require('../../util/constant')
const validator=require('../../middlewares/validator_middleware');

const {
    controller:fetchAllTenderController,
    schema:fetchAllTenderSchema
}=require('../../controllers/tender/audit_approval/fetch_all/fetch_all_controller')
const {
    controller:fetcDetailsController,
    schema:fetchDetailsSchema
}=require('../../controllers/tender/audit_approval/fetch_details/fetch_details_controller');
const {
    controller:passedUpdateController,
    schema:passedUpdateSchema
}=require('../../controllers/tender/audit_approval/passed_or_update/passed_or_update_controller');


const audit_routes=Router();

audit_routes.get(
    API.TMS_API_CONTEXT + API.TMS_AUDIT_APPROVAL_TENDER_LISTS,
    //authenticationMiddleware,
    validator(fetchAllTenderSchema, 'query'),
    fetchAllTenderController
);

audit_routes.get(
    API.TMS_API_CONTEXT + API.TMS_AUDIT_APPROVAL_TENDER_DETAILS,
    //authenticationMiddleware,
    validator(fetchDetailsSchema, 'query'),
    fetcDetailsController
);
audit_routes.post(
    API.TMS_API_CONTEXT + API.TMS_AUDIT_APPROVAL_CHECK_UPDATE,
    //authenticationMiddleware,
    validator(passedUpdateSchema, 'body'),
    passedUpdateController
);



module.exports=audit_routes;