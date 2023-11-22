const { getData } = require("../../../util/dao");
const { dbConfig } = require("../../../util/settings");

const returnWashChallanCreateServices = async(payload)=>{
    const data = await getChallanInformation(payload);
    return data;
}

const getChallanInformation = async(payload)=>{
    const {challan_id} = payload;
    const query = `select ui.FullName, rwcm.RWCMId ChallanId, rwcm.ChallanNo, rwcm.ToUnitId, u.UnitName 
                    ToUnitName, rwcm.TotalGmt TotalGmtQty, ChallanDate 
                    from ReturnWashChallanMaster rwcm
                    inner join Unit u on u.UnitId = rwcm.ToUnitId
                    inner join UserInfo ui on ui.UserId = rwcm.CreatedBy
                    where rwcm.RWCMId = ${challan_id}`;
    const data = await getData(dbConfig, query);
    return data;
}

module.exports = returnWashChallanCreateServices;