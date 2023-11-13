const { TABLE,VIEW } = require("../../util/constant");
const { getData} = require("../../util/dao");
const { dbConfig } = require("../../util/settings");

const challanCheckingSummaryServices = async(payload)=>{
    const data = await getChallanSummary(payload);
    return data;
}

const getChallanSummary = async(payload)=>{
    const {checking_type} = payload;
    let data = null;
    if(checking_type==="WashChecking"){
        data = await getWashChallanSummary(payload);
    }else{
        data = await getFinishingChallanSummary(payload);
    }
    return data;
}

const getWashChallanSummary = async(payload)=>{
    const {challan_id} = payload;
    const query = `select cs.StyleNo, rb.Buyer_name, c.Color, count(distinct nscd.ChildBarcode) TotalPieceQty, 
                    rdc.SignaturePicPath RDCSignPath, approver.SignaturePicPath ApproverSignPath,
                    checker.SignaturePicPath CheckerSignPath
                    from NewSewingChallan nsc
                    inner join NewSewingChallanDetails nscd on nscd.SCId = nsc.SCId
                    inner join CuttingBarcodeTag cbt on cbt.ChildBarcode = nscd.ChildBarcode
                    inner join Cutting c on c.CuttingId = cbt.CuttingId
                    inner join CP_Style cs on cs.Id = cbt.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join ChallanApprovalPermission rdc on rdc.UserId = nsc.RDCUserId
                    left join ChallanApprovalPermission approver on approver.UserId = nsc.ApprovedByUserId
                    left join ChallanApprovalPermission checker on checker.UserId = nsc.CheckedByUserId
                    where nsc.SCId = ${challan_id}
                    group by cs.StyleNo, rb.Buyer_name, c.Color,
                    rdc.SignaturePicPath, approver.SignaturePicPath,
                    checker.SignaturePicPath`;
    const data = await getData(dbConfig, query);
    return data;
}

const getFinishingChallanSummary = async(payload)=>{
    const {challan_id} = payload;
    const query = `select cs.StyleNo, rb.Buyer_name, c.Color, 
                    count(distinct nwcd.ChildBarcode) TotalPieceQty, 
                    rdc.SignaturePicPath RDCSignPath, 
                    approver.SignaturePicPath ApproverSignPath,
                    checker.SignaturePicPath CheckerSignPath from NewWashChallanMaster nwcm
                    inner join NewWashChallanDetails nwcd on nwcd.WCMId = nwcm.WCMId
                    inner join CuttingBarcodeTag cbt on cbt.ChildBarcode = nwcd.ChildBarcode
                    inner join Cutting c on c.CuttingId = cbt.CuttingId
                    inner join CP_Style cs on cs.Id = cbt.StyleId
                    inner join Reg_Buyer rb on rb.Buyer_id = cs.Buyer_id
                    left join ChallanApprovalPermission rdc on rdc.UserId = nwcm.RDCUserId
                    left join ChallanApprovalPermission approver on approver.UserId = nwcm.ApprovedByUserId
                    left join ChallanApprovalPermission checker on checker.UserId = nwcm.CheckedByUserId
                    where nwcm.WCMId = ${challan_id}
                    group by cs.StyleNo, rb.Buyer_name, c.Color, 
                    rdc.SignaturePicPath, approver.SignaturePicPath,
                    checker.SignaturePicPath`;
    const data = await getData(dbConfig, query);
    return data;
}

module.exports = challanCheckingSummaryServices;