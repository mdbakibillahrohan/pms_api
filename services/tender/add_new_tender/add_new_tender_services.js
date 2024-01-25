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
                    UnitOfMeasurement:dta.UnitOfMeasurement,
                    ItemRate:dta.ItemPrice,
                    ItemQuantity:dta.ItemQuantity,
                    ItemValue:dta.ItemTotalAmount,
                    CreatedBy:payload.CreatedBy
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
        MinimumBidAmount,
        CreatedBy
    } = payload;

    const query = `insert into Tender (TenderNo,TenderTitle,TenderDescription,TotalAmount,MinimumBidAmount,CreatedBy) 
    OUTPUT inserted.TenderId
    values(@TenderNo,@TenderTitle,@TenderDescription,@TotalAmount,@MinimumBidAmount,@CreatedBy);`;
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
        ItemName NVARCHAR(200),
        UnitOfMeasurement NVARCHAR(500),
        ItemRate decimal(18,0),
        ItemQuantity decimal(18,0),
        ItemValue decimal(18,0),
        CreatedBy int
    );
    
    -- Insert data into the temporary table using OPENJSON
    INSERT INTO #TempPosts (TenderId, ItemName, UnitOfMeasurement, ItemRate, ItemQuantity,ItemValue,CreatedBy)
    SELECT 
        JSON_VALUE(value, '$.TenderId') AS TenderId,
        JSON_VALUE(value, '$.ItemName') AS ItemName,
        JSON_VALUE(value, '$.UnitOfMeasurement') AS UnitOfMeasurement,
        JSON_VALUE(value, '$.ItemRate') AS ItemRate,
        JSON_VALUE(value, '$.ItemQuantity') AS ItemQuantity,
        JSON_VALUE(value, '$.ItemValue') AS ItemValue,
        JSON_VALUE(value, '$.CreatedBy') AS CreatedBy
    FROM OPENJSON(@json);
    
    -- Insert data from the temporary table into your target table
    INSERT INTO TenderItems (TenderId, ItemName, UnitOfMeasurement, ItemRate,ItemQuantity,ItemValue,CreatedBy)
    SELECT TenderId, ItemName, UnitOfMeasurement, ItemRate,ItemQuantity,ItemValue,CreatedBy
    FROM #TempPosts;
    
    -- Drop the temporary table
    DROP TABLE #TempPosts`;

    const data = await executeQuery(dbConfig3, query,[]);
   
    console.log(data,newLists)
    if(data){
        return {data};
    }

}

module.exports = create_new_tender_services;