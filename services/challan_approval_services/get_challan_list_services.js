

const getChallanListServices = async(payload)=>{
    const {challan_type} = payload;
    let data = null;
    if(challan_type==="sewing"){
        data = await getSewingChallanList(payload);
    }else{
        data = await getWashChallanList(payload);
    }
    return data;
}

const getSewingChallanList = async (payload)=>{
    const {list_type, approver_stack} = payload;
    let query = null;
    let partialQuery = null;

    if(list_type==="waiting"){
        switch(approver_stack){
            case "RDC":
                partialQuery = `RDCUserId = ${approver_id}`;
                break;
            case "ApprovedBy":
                partialQuery = `ApprovedByUserId = ${approver_id}`;
                break;
            case "CheckedBy":
                partialQuery = `CheckedByUserId = ${approver_id}`;
                break;
        }
    }else{

    }
}

const getWashChallanList = async(payload)=>{

}
module.exports = getChallanListServices;