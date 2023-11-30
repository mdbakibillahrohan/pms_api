const { getData, executeQuery } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');

const lineInputEntryServices = async(payload)=>{
    const checkDuplicate=await checkDuplicateEntry(payload);
    if(checkDuplicate===1){
        return {IsEntry:true,message:"Already Exists."};
    }else{
        const data = await lineInputEntry(payload);
        return data;
    }
}

const checkDuplicateEntry=async(payload)=>{
    const {CuttingDetailsId,CuttingId}=payload;

    const query=`select * from Cutting_BundleLineInput 
    where CuttingId=${CuttingId} and CuttingDetailsId=${CuttingDetailsId}`;

    const data = await getData(dbConfig, query);

    if(data.length){
        return 1;
    }else{
        return 0;
    }

}

const lineInputEntry = async(payload)=>{
    const {InputDate, CuttingDetailsId,CuttingId, UnitId, LineId,HourNo,BundleNo,BundleQty,StyleId,CreateBy} = payload;
    const query = `insert into Cutting_BundleLineInput(InputDate,CuttingDetailsId,CuttingId,UnitId,LineId,HourNo,BundleNo,BundleQty,StyleId,CreateBy) 
    values(@InputDate,@CuttingDetailsId,@CuttingId,@UnitId,@LineId,@HourNo,@BundleNo,@BundleQty,@StyleId,@CreateBy);`;
    const params = [
        {
            name: "InputDate",
            value: InputDate
        },
        {
            name: "CuttingDetailsId",
            value: CuttingDetailsId
        },
        {
            name: "CuttingId",
            value: CuttingId
        },
        {
            name: "UnitId",
            value: UnitId
        },
        {
            name: "LineId",
            value: LineId
        },
        {
            name: "HourNo",
            value: HourNo
        },
        {
            name: "BundleNo",
            value: BundleNo
        },
        {
            name: "BundleQty",
            value: BundleQty
        },
        {
            name: "StyleId",
            value: StyleId
        },
        {
            name: "CreateBy",
            value: CreateBy
        },
    ];
    const data = await executeQuery(dbConfig, query, params);
    if(data){
        return {message:"success"};
    }
    return {message:"Error while inserting"};
}


module.exports = lineInputEntryServices;