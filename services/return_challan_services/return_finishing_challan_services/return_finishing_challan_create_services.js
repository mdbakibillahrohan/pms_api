const { getData } = require("../../../util/dao");
const { dbConfig } = require("../../../util/settings");

const returnFinishingChallanCreateServices = async(payload)=>{
    const data = await getChallanInformation(payload);
    return data;
}

const getChallanInformation = async(payload)=>{
    const {challan_id} = payload;
    const query = `select ui.FullName, rfcm.RFCMId ChallanId, rfcm.ChallanNo, rfcm.ToUnitId, 
    u.UnitName ToUnitName, rfcm.TotalGmt TotalGmtQty, ChallanDate
    from ReturnFinishingChallanMaster rfcm 
    inner join Unit u on u.UnitId = rfcm.ToUnitId
    inner join UserInfo ui on ui.UserId = rfcm.CreatedBy
    where rfcm.RFCMId = ${challan_id}`;
    const data = await getData(dbConfig, query);
    return data;
}

module.exports = returnFinishingChallanCreateServices;