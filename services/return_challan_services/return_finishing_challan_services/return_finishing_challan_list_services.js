const {getData} = require('../../../util/dao');
const {dbConfig} = require('../../../util/settings');

const returnFinishingChallanListService = async(payload)=>{
    const data = await getList(payload);
    const count = await getCount(payload);
    return {count, data};
}

const getList = async(payload)=>{
    const query = `select ui.FullName, rfcm.RFCMId ChallanId, rfcm.ChallanNo, rfcm.ToUnitId, 
    u.UnitName ToUnitName, rfcm.TotalGmt TotalGmtQty, ChallanDate
    from ReturnFinishingChallanMaster rfcm 
    inner join Unit u on u.UnitId = rfcm.ToUnitId
    inner join UserInfo ui on ui.UserId = rfcm.CreatedBy
    where 1 = 1 order by rfcm.RFCMId`;
    const data = await getData(dbConfig, query);
    return data;
}

const getCount = async()=>{
    const query = `select count(rfcm.RFCMId) count
    from ReturnFinishingChallanMaster rfcm 
    inner join Unit u on u.UnitId = rfcm.ToUnitId
    inner join UserInfo ui on ui.UserId = rfcm.CreatedBy
    where 1 = 1`;
    const data = await getData(dbConfig, query);
    return data[0].count;
}
module.exports = returnFinishingChallanListService;