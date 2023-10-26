const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const washDashboardServices = async(payload)=>{
    const data = await getWashDashboardData(payload);
    return data;
}


const getWashDashboardData = async (payload)=>{
    const totalReceivedGmtQty = await getTotalReceivedGmtQty(payload);
    const totalDeliveryGmtQty = await getTotalDeliveryGmtQty(payload);
    const totalProductionQty = await getTotalProductionQty(payload);
    const totalRejectQty = await getTotalRejectQty(payload);
    const unitWiseReceivedQty = await getUnitWiseReceivedQty(payload);
    const unitWiseDeliveryQty = await getUnitWiseDeliveryQty(payload);
    const styleWiseReceiveVsStyleWiseDelivery = await getStyleWisReceiveVsStyleWiseDelivery(payload);
    const rejectionPercent = (totalRejectQty[0].TotalReject/totalProductionQty[0].TotalProduction) * 100;
    const wip = totalReceivedGmtQty[0].TotalReceived - totalDeliveryGmtQty[0].TotalDelivery;
    const data = {
        total_received: totalReceivedGmtQty[0].TotalReceived,
        total_delivery: totalDeliveryGmtQty[0].TotalDelivery,
        total_production: totalProductionQty[0].TotalProduction,
        wip,
        rejection_percent: rejectionPercent,
        unit_wise_received: unitWiseReceivedQty,
        unit_wise_delivery: unitWiseDeliveryQty,
        style_wise_receive_vs_style_wise_delivery: styleWiseReceiveVsStyleWiseDelivery
    }
    return data;
}

const getTotalReceivedGmtQty = async (payload)=>{
    const date = getDate(payload);
    const query = `select count(wrd.ChildBarcode) TotalReceived from WashReceiveMaster wrm
    inner join WashReceiveDetails wrd on wrm.WRMId = wrd.WRMId
    where wrm.ReceivedDate = ${date}`;
    const data = await getData(dbConfig, query);
    return data;
}

const getTotalDeliveryGmtQty = async (payload)=>{
    const date = getDate(payload);
    const query = `select isnull(sum(TotalGmtQty), 0) TotalDelivery from NewWashChallanMaster where ChallanDate = ${date} and IsReject = 0`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getTotalProductionQty = async (payload)=>{
    const date = getDate(payload);
    const query = `select count(HWPId) TotalProduction from HourlyWashProductionCount where WashDate = ${date}`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getTotalRejectQty = async (payload)=>{
    const date = getDate(payload);
    const query = `select COUNT(HWDId) TotalReject from HourlyWashDefectCount 
    where DefectId in (select DefectId from IE_Defects where FaultGroupId=3 and ColumnNo = 3) 
    and WashDate = ${date}`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getUnitWiseReceivedQty = async (payload)=>{
    const date = getDate(payload);
    const query = `select u.UnitName, count(wrd.ChildBarcode)GmtQty from WashReceiveMaster wrm
    inner join WashReceiveDetails wrd on wrm.WRMId = wrd.WRMId
    inner join UserInfo ui on ui.UserId = wrd.CreatedBy
    inner join Unit u on u.UnitId = ui.branch_code 
    where wrm.ReceivedDate = ${date}
    group by U.UnitName`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getUnitWiseDeliveryQty = async (payload)=>{
    const date = getDate(payload);
    const query = `select u.UnitName, sum(nwcm.TotalGmtQty) GmtQty from NewWashChallanMaster nwcm 
    inner join Unit u on u.UnitId = nwcm.FromUnitId 
    where nwcm.ChallanDate = ${date} and nwcm.IsReject = 0
    group by u.UnitName`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getStyleWisReceiveVsStyleWiseDelivery = async (payload)=>{
    const date = getDate(payload);
    const query = `select cs.StyleNo, count(wrd.ChildBarcode) ReceiveQty, count(nwcd.ChildBarcode) SendQty from CuttingBarcodeTag cbt
	inner join CP_Style cs on cs.Id = cbt.StyleId
	left join WashReceiveDetails wrd on wrd.ChildBarcode = cbt.ChildBarcode
	inner join NewWashChallanDetails nwcd on nwcd.ChildBarcode = cbt.ChildBarcode
	inner join NewWashChallanMaster nwcm on nwcm.WCMId = nwcd.WCMId
	inner join WashReceiveMaster wrm on wrm.WRMId = wrd.WRMId
	where wrm.ReceivedDate = ${date} and nwcm.ChallanDate = cast(GETDATE() as date)
	group by cs.StyleNo`;
    const data = await getData(dbConfig, query);
    return data; 
}

const getDate = (payload)=>{
    const {date} = payload;
    if(date){
        return `'${date}'`;
    }
    return "CAST(GETDATE() as date)";
}

module.exports = washDashboardServices;