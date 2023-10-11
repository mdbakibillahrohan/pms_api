const { TABLE } = require("../../util/constant");
const {executeQuery, getData} = require("../../util/dao");
const { dbConfig } = require("../../util/settings");

const challanCheckingListServices = async(payload)=>{
    const data = await getList(payload);
    return data;
}

const getList = async(payload)=>{
    const {checking_type} = payload;
    let data = null;
    if(checking_type==="wash"){
        data = await getWashList(payload);
    }else{
        data = await getFinishingList(payload);
    }
    return data;
}

const getWashList = async(payload)=>{
    const {list_type} = payload;
    const {userInfo} = payload;
    let query = null;
    if(list_type==="waiting"){
        query = `select nsc.SCId ChallanId, nsc.ChallanNo, nsc.ChallanDate, nsc.TotalGmtQty, 
                    ufr.UnitName FromUnit, uto.UnitName ToUnit 
                    from ${TABLE.NEW_SEWING_CHALLAN} nsc 
                    inner join Unit ufr on ufr.UnitId = nsc.FromUnitId
                    inner join Unit uto on uto.UnitId = nsc.ToUnitId
                    where 1 = 1 and nsc.ChallanDate is not null and nsc.ToUnitId = ${userInfo.UnitId} and nsc.IsWashChecked = 0 and nsc.RDCUserId != 0 and nsc.ApprovedByUserId != 0 and nsc.CheckedByUserId !=0`;
    }else{
        query = `select nsc.SCId ChallanId, nsc.ChallanNo, nsc.ChallanDate, nsc.TotalGmtQty, 
                    ufr.UnitName FromUnit, uto.UnitName ToUnit 
                    from NewSewingChallan nsc 
                    inner join Unit ufr on ufr.UnitId = nsc.FromUnitId
                    inner join Unit uto on uto.UnitId = nsc.ToUnitId
                    inner join WashChecking wc on wc.SCId = nsc.SCId
                    where 1 = 1 and nsc.ChallanDate is not null and nsc.ToUnitId = ${userInfo.UnitId} 
                    and nsc.IsWashChecked = 1 and nsc.RDCUserId != 0 and nsc.ApprovedByUserId != 0 
                    and nsc.CheckedByUserId !=0 and wc.UserId = ${userInfo.UserId}`;
    }
    const data = await getData(dbConfig, query);
    return data;
}

const getFinishingList = async(payload)=>{
    const {list_type} = payload;
    const {userInfo} = payload;
    let query = null;
    if(list_type==="waiting"){
        query = `select wcm.WCMId ChallanId, wcm.ChallanNo, wcm.ChallanDate, wcm.TotalGmtQty, 
                    ufr.UnitName FromUnit, uto.UnitName ToUnit 
                    from NewWashChallanMaster wcm 
                    inner join Unit ufr on ufr.UnitId = wcm.FromUnitId
                    inner join Unit uto on uto.UnitId = wcm.ToUnitId
                    where 1 = 1 and wcm.ChallanDate is not null and wcm.ToUnitId = ${userInfo.UnitId} 
                    and wcm.IsFinishingChecked = 0 and wcm.RDCUserId != 0 and wcm.ApprovedByUserId != 0 
                    and wcm.CheckedByUserId !=0`;
    }else{
        query = `select wcm.WCMId ChallanId, wcm.ChallanNo, wcm.ChallanDate, wcm.TotalGmtQty, 
                    ufr.UnitName FromUnit, uto.UnitName ToUnit 
                    from NewWashChallanMaster wcm 
                    inner join Unit ufr on ufr.UnitId = wcm.FromUnitId
                    inner join Unit uto on uto.UnitId = wcm.ToUnitId
                    inner join FinishingChecking fc on fc.WCMId = wcm.WCMId
                    where 1 = 1 and wcm.ChallanDate is not null and wcm.ToUnitId = ${userInfo.UnitId} 
                    and wcm.IsFinishingChecked = 1 and wcm.RDCUserId != 0 and wcm.ApprovedByUserId != 0 
                    and wcm.CheckedByUserId !=0 and fc.UserId = ${userInfo.UserId}`
    }
    const data = await getData(dbConfig, query);
    return data;
}



module.exports = challanCheckingListServices;
