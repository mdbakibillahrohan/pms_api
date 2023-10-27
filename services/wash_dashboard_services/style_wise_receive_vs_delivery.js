const { getData } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const styleWiseReceiveVsDeliverService = async (payload)=>{
    const data = await getStyleWisReceiveVsStyleWiseDeliveryData(payload);
    return data;
}

const getStyleWisReceiveVsStyleWiseDeliveryData = async (payload)=>{
    const date = getDate(payload);
    const query = `select cs.StyleNo, count(wrd.ChildBarcode) ReceiveQty, count(nwcd.ChildBarcode) SendQty from CuttingBarcodeTag cbt with(nolock)
	inner join CP_Style cs with(nolock) on cs.Id = cbt.StyleId
	left join WashReceiveDetails wrd with(nolock) on wrd.ChildBarcode = cbt.ChildBarcode
	inner join NewWashChallanDetails nwcd with(nolock) on nwcd.ChildBarcode = cbt.ChildBarcode
	left join NewWashChallanMaster nwcm with(nolock) on nwcm.WCMId = nwcd.WCMId
	left join WashReceiveMaster wrm with(nolock) on wrm.WRMId = wrd.WRMId
	where wrm.ReceivedDate = ${date} and nwcm.ChallanDate = cast(GETDATE() as date)
	group by cs.StyleNo`;
    const data = await getData(dbConfig, query);
    return data; 
}

 module.exports = styleWiseReceiveVsDeliverService;