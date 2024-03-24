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

        if(data && payload.CurrentItems.length && payload?.PreviousItems?.length){

            const prevItemLists=[...payload.PreviousItems];

            if(prevItemLists.length){
                let filters=[];

                prevItemLists.map((d)=>{
                    let Find=false;
                    payload.CurrentItems.map((dt)=>{
                        if(!Find){
                            if(dt.ItemId==d.ItemId){
                                Find=true;
                            }
                        }
                    })

                    if(!Find){
                        const obj={
                            ItemId:d.ItemId
                        }
                        filters=[...filters,obj];
                    }
                })
                let result2="";
                
                // console.log("Prev Items : ",prevItemLists)
                // console.log("Filters",filters)
                // console.log("Filters",payload.CurrentItems)

                if(filters.length){
                    result2=await deactiveTenderItems(filters);
                }else{
                    result2=true;
                }
                
                if(result2){
                    let myLists=[];

                    payload.CurrentItems.forEach((dta)=>{
                        const newObj={
                            TenderId:dta.TenderId,
                            ItemId:dta.ItemId,
                            ItemName:dta.ItemName,
                            ItemRemarks:dta.ItemRemarks,
                            TenderGradeId:dta.ItemGrade,
                            UnitOfMeasurement:dta.UnitOfMeasurement,
                            ItemRate:dta.ItemPrice,
                            TargetRate:dta.ItemTargetPrice,
                            ItemQuantity:dta.ItemQuantity,
                            ItemValue:dta.ItemTotalAmount,
                            CreatedBy:dta.CreatedBy,
                            LastBidDate:dta.LastBidDate
                        }

                        myLists=[...myLists,newObj]
                    })

                    //console.log("Lists : ",myLists)
                    const result3=await updateTenderItems(myLists);

                    if(data && result2 && result3){
                        return {message:"success"};
                    }else{
                        return 0;
                    }
                }else{
                    return 0;
                }
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

const deactiveTenderItems=async(lists)=>{
    const newLists=[...lists];
    //console.log("PP",payload)
    try{
        newLists.map(async(d)=>{
            const query = `update TenderItems set IsDeleted=1 where ItemId=${d.ItemId}`;
            const data = await executeQuery(dbConfig3, query, []);
        })
        return 1;
    }catch{
        return 0
    }

   
   // return {message:"Error while deleting"};
}


const updateTenderItems=async(lists)=>{
    const newLists=[...lists];
    //console.log("Lists",newLists)

    try{
        newLists.map(async(d)=>{
            if(d.ItemId=="100001"){
                const {
                    TenderId,
                    ItemName,
                    ItemRemarks,
                    TenderGradeId,
                    UnitOfMeasurement,
                    ItemRate,
                    TargetRate,
                    ItemQuantity,
                    ItemValue,
                    CreatedBy,
                    LastBidDate
                }=d;
                const query = `insert into TenderItems (TenderId,ItemName,ItemRemarks,TenderGradeId,UnitOfMeasurement,ItemRate,TargetRate,ItemQuantity,ItemValue,LastBidDate,CreatedBy)
                values(@TenderId,@ItemName,@ItemRemarks,@TenderGradeId,@UnitOfMeasurement,@ItemRate,@TargetRate,@ItemQuantity,@ItemValue,@LastBidDate,@CreatedBy);`;
                const params = [
                    {
                        name: "TenderId",
                        value: TenderId
                    },
                    {
                        name: "ItemName",
                        value: ItemName
                    },
                    {
                        name: "ItemRemarks",
                        value: ItemRemarks
                    },
                    {
                        name: "TenderGradeId",
                        value: TenderGradeId
                    },
                    {
                        name: "UnitOfMeasurement",
                        value: UnitOfMeasurement
                    },
                    {
                        name: "ItemRate",
                        value: ItemRate
                    },
                    {
                        name: "TargetRate",
                        value: TargetRate
                    },
                    {
                        name: "ItemQuantity",
                        value: ItemQuantity
                    },
                    {
                        name: "ItemValue",
                        value: ItemValue
                    },
                    {
                        name: "LastBidDate",
                        value: LastBidDate
                    },
                    {
                        name: "CreatedBy",
                        value: CreatedBy
                    }
                ];
                // const query=`update TenderItems set TargetRate=${TargetRate},ItemValue=${ItemValue},UpdatedBy=${UpdatedBy},UpdatedAt=getDate() where ItemId=${ItemId}`;
                //const query=`update TenderItems set TargetRate=${TargetRate},ItemValue=${ItemValue},UpdatedBy=${UpdatedBy},UpdatedAt=getDate() where ItemId=${ItemId}`;
    
                const data = await executeQuery(dbConfig3, query, params);
            }else{
                const {
                    ItemId,
                    ItemName,
                    ItemRemarks,
                    TenderGradeId,
                    UnitOfMeasurement,
                    ItemRate,
                    TargetRate,
                    ItemQuantity,
                    ItemValue,
                    CreatedBy,
                    LastBidDate
                }=d;

                const query=`update TenderItems set ItemName=N'${ItemName}',ItemRemarks=N'${ItemRemarks}',TenderGradeId=${TenderGradeId},UnitOfMeasurement='${UnitOfMeasurement}',ItemRate=${ItemRate},TargetRate=${TargetRate},ItemQuantity=${ItemQuantity},ItemValue=${ItemValue},LastBidDate='${LastBidDate}',UpdatedBy=${CreatedBy},UpdatedAt=getDate() where ItemId=${ItemId}`;
    
                const data = await executeQuery(dbConfig3, query, []); 
            }
            
        })
        return 1;
    }catch{
        return 0;
    }
}

module.exports = create_new_tender_services;