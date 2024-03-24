const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const create_new_tender_services = async(payload)=>{
    const data = await insertNewTender(payload);
    if(data){
        const {
            TenderId
        }=data.data[0];

        if(TenderId && payload.Details.length){
            let myLists=[];

            payload.Details.forEach((dta)=>{
                const newObj={
                    TenderId:TenderId,
                    ItemName:dta.ItemName,
                    ItemRemarks:dta.ItemRemarks,
                    UnitOfMeasurement:dta.UnitOfMeasurement,
                    ItemGrade:dta.ItemGrade,
                    ItemRate:dta.ItemPrice?dta.ItemPrice:0,
                    TargetRate:dta.ItemTargetPrice,
                    ItemQuantity:dta.ItemQuantity,
                    ItemValue:dta.ItemTotalAmount,
                    CreatedBy:payload.CreatedBy,
                    LastBidDate:dta.LastBidDate?dta.LastBidDate:""
                }

                myLists=[...myLists,newObj]
            })

            const result2=await insertTenderItemLists(myLists);

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

const insertNewTender = async(payload)=>{
    const {
        TenderNo, 
        TenderTitle,
        TenderDetails,
        TenderTotalAmount,
        TenderAttachment, 
        MinimumBidAmount,
        CreatedBy
    } = payload;

    const query = `insert into Tender (TenderNo,TenderTitle,TenderDescription,TotalAmount,MinimumBidAmount,TenderAttachment,CreatedBy) 
    OUTPUT inserted.TenderId
    values(@TenderNo,@TenderTitle,@TenderDescription,@TotalAmount,@MinimumBidAmount,@TenderAttachment,@CreatedBy);`;
    const params = [
        {
            name: "TenderNo",
            value: TenderNo
        },
        {
            name: "TenderTitle",
            value: TenderTitle
        },
        {
            name: "TenderDescription",
            value: TenderDetails
        },
        {
            name: "TotalAmount",
            value: parseFloat(TenderTotalAmount).toFixed(2)
        },
        {
            name: "MinimumBidAmount",
            value: MinimumBidAmount
        },
        {
            name: "TenderAttachment",
            value: TenderAttachment
        },
        {
            name: "CreatedBy",
            value: CreatedBy
        }
    ];
    const data = await executeQueryWithReturnId(dbConfig3, query, params);
   
    if(data){
        return {data};
    }
    return {message:"Error while inserting"};
}


const insertTenderItemLists=async(lists)=>{
    const newLists=[...lists];

    const query=`DECLARE @json NVARCHAR(MAX) = '${JSON.stringify(newLists)}';

    CREATE TABLE #TempPosts
    (
        TenderId int,
        ItemName NVARCHAR(500),
        ItemRemarks NVARCHAR(500),
        TenderGradeId int,
        UnitOfMeasurement NVARCHAR(500),
        ItemRate decimal(18,0),
        TargetRate decimal(18,0),
        ItemQuantity decimal(18,0),
        ItemValue decimal(18,0),
        CreatedBy int,
        LastBidDate datetime default null
    );
    
    -- Insert data into the temporary table using OPENJSON
    INSERT INTO #TempPosts (TenderId, ItemName,ItemRemarks,TenderGradeId, UnitOfMeasurement, ItemRate,TargetRate, ItemQuantity,ItemValue,CreatedBy,LastBidDate)
    SELECT 
        JSON_VALUE(value, '$.TenderId') AS TenderId,
        JSON_VALUE(value, '$.ItemName') AS ItemName,
        JSON_VALUE(value, '$.ItemRemarks') AS ItemRemarks,
        JSON_VALUE(value, '$.ItemGrade') AS TenderGradeId,
        JSON_VALUE(value, '$.UnitOfMeasurement') AS UnitOfMeasurement,
        JSON_VALUE(value, '$.ItemRate') AS ItemRate,
        JSON_VALUE(value, '$.TargetRate') AS TargetRate,
        JSON_VALUE(value, '$.ItemQuantity') AS ItemQuantity,
        JSON_VALUE(value, '$.ItemValue') AS ItemValue,
        JSON_VALUE(value, '$.CreatedBy') AS CreatedBy,
        JSON_VALUE(value, '$.LastBidDate') AS LastBidDate
    FROM OPENJSON(@json);
    
    -- Insert data from the temporary table into your target table
    INSERT INTO TenderItems (TenderId,ItemName,ItemRemarks,TenderGradeId, UnitOfMeasurement, ItemRate,TargetRate,ItemQuantity,ItemValue,CreatedBy,LastBidDate)
    SELECT TenderId,ItemName,ItemRemarks, TenderGradeId,UnitOfMeasurement, ItemRate,TargetRate,ItemQuantity,ItemValue,CreatedBy,LastBidDate
    FROM #TempPosts;
    
    -- Drop the temporary table
    DROP TABLE #TempPosts`;

    const data = await executeQuery(dbConfig3, query,[]);
   
    //console.log(data)
    if(data){
        return {data};
    }

}

module.exports = create_new_tender_services;