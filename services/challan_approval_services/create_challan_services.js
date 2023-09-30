const { TABLE } = require("../../util/constant");
const { getData } = require("../../util/dao");
const { dbConfig } = require("../../util/settings");


const createChallanServices = async(payload)=>{
    const challanInformation = await getChallanInformation(payload);
    return challanInformation;
}

const getChallanInformation = async(payload)=>{
    const {challan_id, challan_type} = payload;
    let query = null;
    if(challan_type=="sewing"){
        query = `select ui.FullName, nsc.SCId ChallanId, nsc.ChallanNo, u.UnitName 
        ToUnitName, TotalGmtQty, ChallanDate from ${TABLE.NEW_SEWING_CHALLAN} nsc
        inner join Unit u on u.UnitId = nsc.ToUnitId
        inner join UserInfo ui on ui.UserId = nsc.CreatedBy
        where nsc.SCId = ${challan_id}`;
    }else{
        query = `select ui.FullName, nwcm.WCMId ChallanId, nwcm.ChallanNo, 
        u.UnitName ToUnitName, TotalGmtQty, 
        ChallanDate from NewWashChallanMaster nwcm
        inner join Unit u on u.UnitId = nwcm.ToUnitId
        inner join UserInfo ui on ui.UserId = nwcm.CreatedBy
        where nwcm.WCMId = ${challan_id}`;
    }
    const data = await getData(dbConfig, query);
    return data[0];
}

module.exports = createChallanServices;