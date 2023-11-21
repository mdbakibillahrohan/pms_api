const {getData} = require('../../../util/dao');
const {dbConfig} = require('../../../util/settings');

const returnWashChallanListService = async(payload)=>{
    const data = await getList(payload);
    const count = await getCount(payload);
    return {count, data};
}

const getList = async(payload)=>{
    const query = `select rwcm.RWCMId ChallanId, rwcm.ChallanNo, 
    rwcm.ChallanDate, rwcm.TotalGmt TotalGmtQty, 
    ufr.UnitName FromUnit, uto.UnitName ToUnit from ReturnWashChallanMaster rwcm
    inner join Unit ufr on ufr.UnitId = rwcm.FromUnitId
    inner join Unit uto on uto.UnitId = rwcm.ToUnitId 
    where 1 = 1 order by rwcm.RWCMId desc`;
    const data = await getData(dbConfig, query);
    return data;
}

const getCount = async()=>{
    const query = `select count(rwcm.RWCMId) count from ReturnWashChallanMaster rwcm
    inner join Unit ufr on ufr.UnitId = rwcm.FromUnitId
    inner join Unit uto on uto.UnitId = rwcm.ToUnitId 
    where 1 = 1`;
    const data = await getData(dbConfig, query);
    return data[0].count;
}
module.exports = returnWashChallanListService;