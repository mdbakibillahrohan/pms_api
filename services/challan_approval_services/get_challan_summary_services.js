const { TABLE, VIEW } = require("../../util/constant");
const { getData } = require("../../util/dao");
const { dbConfig } = require("../../util/settings");

const getChallanSummaryServices = async(payload)=>{
    const data = await getChallanSummary(payload);
    return data;
}

const getChallanSummary = async(payload)=>{
    const {challan_type} = payload;
    let data = null;
    if(challan_type==="sewing"){
        data = await getSewingChallanSummary(payload);
    }else{
        data = await getWashChallanSummary(payload);
    }
    return data;
}

const getSewingChallanSummary = async(payload)=>{
    const {challan_id} = payload;
    const query = `select nsc.ChallanNo, cs.StyleNo, nscs.GmtQty, vb.Buyer_name 
                from ${TABLE.NEW_SEWING_CHALLAN_SUMMARY} nscs
                inner join ${TABLE.NEW_SEWING_CHALLAN} nsc on nscs.SCId = nsc.SCId
                inner join ${TABLE.CP_STYLE} cs on cs.Id = nscs.StyleId
                inner join ${VIEW.BUYER} vb on vb.Buyer_id = cs.Buyer_id
                where nscs.SCId = ${challan_id}
                group by nsc.ChallanNo, cs.StyleNo, nscs.GmtQty,  vb.Buyer_name`;
    const data = await getData(dbConfig, query);
    return data;
}

const getWashChallanSummary = async()=>{
    const {challan_id} = payload;
    const query = `select nwcm.ChallanNo, cs.StyleNo, nwcs.GmtQty, 
                    vb.Buyer_name from ${TABLE.NEW_WASH_CHALLAN_SUMMARY} nwcs
                    inner join ${TABLE.NEW_WASH_CHALLAN} nwcm on nwcm.WCMId = nwcs.WCMId
                    inner join ${TABLE.CP_STYLE} cs on cs.Id = nwcs.StyleId
                    inner join ${VIEW.BUYER} vb on vb.Buyer_id = cs.Buyer_id
                    where nwcs.WCMId = ${challan_id} 
                    group by nwcm.ChallanNo, cs.StyleNo, nwcs.GmtQty, vb.Buyer_name`;
    const data = await getData(dbConfig, query);
    return data;
}

module.exports = getChallanSummaryServices;