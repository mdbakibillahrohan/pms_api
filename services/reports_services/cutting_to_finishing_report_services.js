const {getData} = require('../../util/dao');
const {dbConfig} = require('../../util/settings');

const cuttingToFinishingReportServices = async(payload)=>{
    const data = await getCuttingToFinishingReport(payload);
    return data;
}

const getCuttingToFinishingReport = async(payload)=>{
    const cuttingData = await getCuttingData(payload);
    const sewingInData = await getSewingInData(payload);
    const sewingOutData = await getSewintOutData(payload);
    const washInData = await getWashInData(payload);
    const washOutData = await getWashOutData(payload);
    const finishingInData = await getFinishingInData(payload);
    const finishingOutData = await getFinishingOutData(payload);
    return {cuttingData,sewingInData, sewingOutData, washInData, washOutData, finishingInData, finishingOutData};
}

const getCuttingData = async(payload)=>{
    const {fromDate, toDate, sortBy} = payload;
    let query = null;
    if(sortBy==="all"){
        query = `select sum(CuttingQty) TotalCutting from View_Cutting where cast(CutDate as date) BETWEEN '${fromDate}' and '${toDate}'`;
    }else if(sortBy==="style"){
        query = `select rb.Buyer_name, cs.StyleNo, sum(CuttingQty) Gmt from View_Cutting vc
        inner join CP_Style cs on cs.Id = vc.StyleId
        inner join Reg_Buyer rb on rb.Buyer_id = vc.Buyer_id
        where cast(vc.CutDate as date) BETWEEN '${fromDate}' and '${toDate}' 
        group by rb.Buyer_name, cs.StyleNo`;
    }else{
        query = ` select rb.Buyer_name, sum(CuttingQty) Gmt from View_Cutting vc
        inner join Reg_Buyer rb on rb.Buyer_id = vc.Buyer_id
        where cast(vc.CutDate as date) BETWEEN '${fromDate}' and '${toDate}' 
        group by rb.Buyer_name`;
    }
    const data = await getData(dbConfig, query);
    return data;
}

const getSewingInData = async(payload)=>{
    const {fromDate, toDate, unitId} = payload;
    let query = `select sum(TotalChallanQty) TotalPcs from CuttingChallanMasterNew 
    where cast(CreateDate as date) BETWEEN '${fromDate}' and '${toDate}'`;
    const data = await getData(dbConfig, query);
    return data;
}

const getSewintOutData = async(payload)=>{
    const {fromDate, toDate, sortBy} = payload;
    let query = null;
    if(sortBy==="all"){
        query = `select sum(TotalGmtQty) SewingOut from NewSewingChallan 
        where RDCUserId!=0 and ApprovedByUserId!=0 and CheckedByUserId!=0 
        and ChallanDate BETWEEN '${fromDate}' and '${toDate}'`;
    }else if(sortBy==="style"){
        query = `select cs.StyleNo, rb.Buyer_name, sum(nscs.GmtQty) Garments from NewSewingChallanSummary nscs
        inner join NewSewingChallan nsc on nsc.SCId = nscs.SCId
        inner join CP_Style cs on cs.Id = nscs.StyleId 
        left join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where nsc.RDCUserId!=0 and nsc.ApprovedByUserId!=0 and nsc.CheckedByUserId!=0 
        and nsc.ChallanDate BETWEEN '${fromDate}' and '${toDate}' and FromUnitId = 7
        group by cs.StyleNo, rb.Buyer_name`;
    }else{
        query = `select rb.Buyer_name, sum(nscs.GmtQty) Garments from NewSewingChallanSummary nscs
        inner join NewSewingChallan nsc on nsc.SCId = nscs.SCId
        inner join CP_Style cs on cs.Id = nscs.StyleId 
        left join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where nsc.RDCUserId!=0 and nsc.ApprovedByUserId!=0 and nsc.CheckedByUserId!=0 
        and nsc.ChallanDate BETWEEN '${fromDate}' and '${toDate}' and FromUnitId = 7
        group by rb.Buyer_name`;
    }
    const data = await getData(dbConfig, query);
    return data;
}

const getWashInData = async(payload)=>{
    const {fromDate, toDate, sortBy} = payload;
    let query = null;
    if(sortBy==="all"){
        query = `select count(wrd.ChildBarcode) WashIn from WashReceiveMaster wrm
        inner join WashReceiveDetails wrd on wrd.WRMId = wrm.WRMId
        inner join UserInfo ui on ui.UserId = wrm.CreatedBy
        where wrm.ReceivedDate BETWEEN '${fromDate}' and '${toDate}'`;
    }else if(sortBy==="style"){
        query = `select rb.Buyer_name, cs.StyleNo, count(distinct wrd.ChildBarcode) Gmt from WashReceiveMaster wrm
        inner join WashReceiveDetails wrd on wrd.WRMId = wrm.WRMId
        inner join UserInfo ui on ui.UserId = wrm.CreatedBy
        inner join HourlySewingProductionCount hspc on hspc.ChildBarcode = wrd.ChildBarcode
        inner join CP_Style cs on cs.Id = hspc.StyleId
        inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where wrm.ReceivedDate BETWEEN '${fromDate}' and '${toDate}'
        group by cs.StyleNo, rb.Buyer_name`;
    }else{
        query = `select rb.Buyer_name, count(distinct wrd.ChildBarcode) Gmt from WashReceiveMaster wrm
        inner join WashReceiveDetails wrd on wrd.WRMId = wrm.WRMId
        inner join UserInfo ui on ui.UserId = wrm.CreatedBy
        inner join HourlySewingProductionCount hspc on hspc.ChildBarcode = wrd.ChildBarcode
        inner join CP_Style cs on cs.Id = hspc.StyleId
        inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where wrm.ReceivedDate BETWEEN '${fromDate}' and '${toDate}'
        group by rb.Buyer_name`;
    }
    const data = await getData(dbConfig, query);
    return data;
}

const getWashOutData = async(payload)=>{
    const {fromDate, toDate, sortBy} = payload;
    let query = null;
    if(sortBy==="all"){
        query = `select sum(TotalGmtQty) WashOut from NewWashChallanMaster 
        where RDCUserId!=0 and ApprovedByUserId!=0 and CheckedByUserId!=0 
        and ChallanDate BETWEEN '${fromDate}' and '${toDate}'`;
    }else if(sortBy==="style"){
        query = `select cs.StyleNo, rb.Buyer_name, convert(bigint, sum(nwcs.GmtQty)) Garments from NewWashChallanSummary nwcs
        inner join NewWashChallanMaster nwcm on nwcm.WCMId = nwcs.WCMId
        inner join CP_Style cs on cs.Id = nwcs.StyleId 
        left join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where nwcm.RDCUserId!=0 and nwcm.ApprovedByUserId!=0 and nwcm.CheckedByUserId!=0 
        and nwcm.ChallanDate BETWEEN '${fromDate}' and '${toDate}'
        group by cs.StyleNo, rb.Buyer_name`;
    }else{
        query = `select rb.Buyer_name, convert(bigint, sum(nwcs.GmtQty)) Garments from NewWashChallanSummary nwcs
        inner join NewWashChallanMaster nwcm on nwcm.WCMId = nwcs.WCMId
        inner join CP_Style cs on cs.Id = nwcs.StyleId 
        left join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where nwcm.RDCUserId!=0 and nwcm.ApprovedByUserId!=0 and nwcm.CheckedByUserId!=0 
        and nwcm.ChallanDate BETWEEN '${fromDate}' and '${toDate}'
        group by  rb.Buyer_name`;
    }
    const data = await getData(dbConfig, query);
    return data;
}

const getFinishingInData = async(payload)=>{
    const {fromDate, toDate, sortBy} = payload;
    let query = null;
    if(sortBy==="all"){
        query = `select count(frd.ChildBarcode) FinishingIn from FinishingReceiveMaster frm
        inner join FinishingReceiveDetails frd on frd.FRMId = frm.FRMId
        where frm.ReceivedDate BETWEEN '${fromDate}' and '${toDate}'`;
    }else if(sortBy==="style"){
        query = `select rb.Buyer_name, cs.StyleNo, count(distinct frd.ChildBarcode) Gmt from FinishingReceiveMaster frm
        inner join FinishingReceiveDetails frd on frm.FRMId = frd.FRMId
        inner join UserInfo ui on ui.UserId = frm.CreatedBy
        inner join HourlySewingProductionCount hspc on hspc.ChildBarcode = frd.ChildBarcode
        inner join CP_Style cs on cs.Id = hspc.StyleId
        inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where frm.ReceivedDate BETWEEN '${fromDate}' and '${toDate}'
        group by cs.StyleNo, rb.Buyer_name`;
    }else{
        query = `select rb.Buyer_name, count(distinct frd.ChildBarcode) Gmt from FinishingReceiveMaster frm
        inner join FinishingReceiveDetails frd on frm.FRMId = frd.FRMId
        inner join UserInfo ui on ui.UserId = frm.CreatedBy
        inner join HourlySewingProductionCount hspc on hspc.ChildBarcode = frd.ChildBarcode
        inner join CP_Style cs on cs.Id = hspc.StyleId
        inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where frm.ReceivedDate BETWEEN '${fromDate}' and '${toDate}' and ui.branch_code = 7
        group by rb.Buyer_name`;
    }
    const data = await getData(dbConfig, query);
    return data;
}

const getFinishingOutData = async(payload)=>{
    const {fromDate, toDate, sortBy} = payload;
    let query = null;
    if(sortBy==="all"){
        query = `select Count(HFPId) FinishingOut from HourlyFinishingProductionCount where ProductionDate BETWEEN '${fromDate}' and '${toDate}'`;
    }else if(sortBy==="style"){
        query = `select rb.Buyer_name, cs.StyleNo,  Count(hfpc.HFPId) Gmt from HourlyFinishingProductionCount hfpc
        inner join CP_Style cs on cs.Id = hfpc.StyleId
        inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where ProductionDate BETWEEN '${fromDate}' and '${toDate}'
        group by rb.Buyer_name, cs.StyleNo`;
    }else{
        query = `select rb.Buyer_name,  Count(hfpc.HFPId) Gmt from HourlyFinishingProductionCount hfpc
        inner join CP_Style cs on cs.Id = hfpc.StyleId
        inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
        where ProductionDate BETWEEN '${fromDate}' and '${toDate}'
        group by rb.Buyer_name`;
    }
    const data = await getData(dbConfig, query);
    return data;
}

module.exports = cuttingToFinishingReportServices;