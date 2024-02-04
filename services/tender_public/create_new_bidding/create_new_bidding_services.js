const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const create_new_bidding_services = async(payload)=>{
    const data = await insertNewTender(payload);
    if(data){
        const {
            BiddingId
        }=data.data[0];

        if(BiddingId && payload.Details.length){
            let myLists=[];

            payload.Details.forEach((dta)=>{
                const newObj={
                    BiddingId:BiddingId,
                    TenderUserId:dta.TenderUserId,
                    ItemId:dta.ItemId,
                    BidPrice:dta.BidPrice
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
        TenderId, 
        TenderBidId,
        TenderUserId,
        TotalAmount
    } = payload;

    const query = `insert into Bidding (TenderId,TenderBidId,TenderUserId,TotalAmount) 
    OUTPUT inserted.BiddingId
    values(@TenderId,@TenderBidId,@TenderUserId,@TotalAmount);`;
    const params = [
        {
            name: "TenderId",
            value: TenderId
        },
        {
            name: "TenderBidId",
            value: TenderBidId
        },
        {
            name: "TenderUserId",
            value: TenderUserId
        },
        {
            name: "TotalAmount",
            value: parseFloat(TotalAmount).toFixed(2)
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

    console.log("Lists",lists)
    const query=`DECLARE @json NVARCHAR(MAX) = '${JSON.stringify(newLists)}';

    CREATE TABLE #TempPosts
    (
        BiddingId int,
        TenderUserId int,
        ItemId int,
        BidPrice decimal(18,0),
    );
    
    -- Insert data into the temporary table using OPENJSON
    INSERT INTO #TempPosts (BiddingId, TenderUserId, ItemId, BidPrice)
    SELECT 
        JSON_VALUE(value, '$.BiddingId') AS BiddingId,
        JSON_VALUE(value, '$.TenderUserId') AS TenderUserId,
        JSON_VALUE(value, '$.ItemId') AS ItemId,
        JSON_VALUE(value, '$.BidPrice') AS BidPrice
    FROM OPENJSON(@json);
    
    -- Insert data from the temporary table into your target table
    INSERT INTO BiddingDetails (BiddingId, TenderUserId, ItemId, BidPrice)
    SELECT BiddingId, TenderUserId, ItemId, BidPrice
    FROM #TempPosts;
    
    -- Drop the temporary table
    DROP TABLE #TempPosts`;

    const data = await executeQuery(dbConfig3, query,[]);
   
    console.log(data,newLists)
    if(data){
        return {data};
    }

}

module.exports = create_new_bidding_services;