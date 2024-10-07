const {
    Router
}=require("express");
const tender_category_routes=require('./category');
const audit_routes=require('./audit_approval');
const user_cat_map_routes=require("./user_cat_map");


const tender_routes_main=Router();


tender_routes_main.use(tender_category_routes);
tender_routes_main.use(audit_routes);
tender_routes_main.use(user_cat_map_routes);


module.exports=tender_routes_main;