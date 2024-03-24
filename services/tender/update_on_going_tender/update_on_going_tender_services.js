const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const create_new_tender_services = async(payload)=>{
    const data = await updateTender(payload);
    if(data){

        if(data && payload.Details.length){
            let myLists=[];

            payload.Details.forEach((dta)=>{
                const newObj={
                    ItemId:dta.ItemId,
                    TargetRate:dta.TargetRate,
                    ItemValue:dta.ItemValue,
                    UpdatedBy:payload.UpdatedBy,
                }

                myLists=[...myLists,newObj]
            })

            const result2=await updateTenderItems(myLists);

            if(data && result2){
                return {message:"success"};
            }else{
                return 0;
            }
        }
    }else{
        return 0;
    }
    
}

const updateTender = async(payload)=>{
    const {
        TenderNo, 
        TenderTitle,
        TenderDetails,
        TenderTotalAmount,
        TenderAttachment, 
        MinimumBidAmount,
        UpdatedBy
    } = payload;

    //console.log("PP",payload)

    const query = `update Tender set TenderTitle=N'${TenderTitle}',TenderDescription=N'${TenderDetails}',
    TotalAmount=${TenderTotalAmount},MinimumBidAmount=${MinimumBidAmount},TenderAttachment='${TenderAttachment}',
    UpdatedBy=${UpdatedBy},UpdatedAt=getDate() where TenderNo='${TenderNo}'`;
    //console.log("Query",query)
    const data = await executeQuery(dbConfig3, query, []);

    //console.log("DD",data)
   
    if(data){
        return 1;
    }
    return {message:"Error while inserting"};
}


const updateTenderItems=async(lists)=>{
    const newLists=[...lists];
    //console.log("Lists",newLists)

    try{
        newLists.map(async(d)=>{
            const {
                ItemId,
                TargetRate,
                ItemValue,
                UpdatedBy
            }=d;
            const query=`update TenderItems set TargetRate=${TargetRate},ItemValue=${ItemValue},UpdatedBy=${UpdatedBy},UpdatedAt=getDate() where ItemId=${ItemId}`;

            const data = await executeQuery(dbConfig3, query,[]);
        })
        return 1;
    }catch{
        return 0;
    }
}

module.exports = create_new_tender_services;