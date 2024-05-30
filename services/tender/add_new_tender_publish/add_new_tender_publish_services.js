const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const create_new_tender_publish_services = async(payload)=>{
    
    const {TenderBidId}=payload;

    if(TenderBidId===10001){
        const checkDuplicate=await checkDuplicateEntry(payload);

        if(checkDuplicate){
            return {message:"exists"};
        }else{
            const data = await insertNewTenderPublish(payload);
            if(data){
                return {message:"success",data:data};
            }else{
                return 0;
            }
        }
    }else{
        const data = await insertNewTenderPublish(payload);
        if(data){
            return {message:"success",data:data};
        }else{
            return 0;
        }
    }
}

const insertNewTenderPublish = async(payload)=>{
    const {
        TenderBidId,
        TenderId,
        Description,
        Users, 
        OpenDate,
        CloseDate,
        CreatedBy
    } = payload;


    let data;
    if(TenderBidId===10001){
        const query = `insert into TenderBidLists (TenderId,Description,OpenDate,CloseDate,CreatedBy) 
        OUTPUT inserted.TenderBidId
        values(@TenderId,@Description,@OpenDate,@CloseDate,@CreatedBy);`;
        const params = [
            {
                name: "TenderId",
                value: TenderId
            },
            {
                name: "Description",
                value: Description
            },
            {
                name: "OpenDate",
                value: OpenDate
            },
            {
                name: "CloseDate",
                value: CloseDate
            },
            {
                name: "CreatedBy",
                value: CreatedBy
            }
        ];
        data = await executeQueryWithReturnId(dbConfig3, query, params);
        console.log("data",data);

        if(data){
            const {
                TenderBidId
            }=data[0];

            if(TenderBidId){
                if(Users?.length){
                    let lists=[];
                    Users.forEach((d)=>{
                        const object={
                            TenderBidId:TenderBidId,
                            TenderId:TenderId,
                            TenderUserId:d?.TenderUserId,
                            CreatedBy:CreatedBy
                        }

                        lists=[...lists,object];
                    })

                    const result2=await insertTenderUsers(lists);

                    if(data && result2){
                        return {message:"success"};
                    }else{
                        return 0;
                    }
                }
            }
        }

    }else{
        const query = `update TenderBidLists set OpenDate='${OpenDate}',CloseDate='${CloseDate}',UpdatedBy=${CreatedBy},UpdatedAt=getDate() where TenderBidId=${TenderBidId}`;
        data = await executeQuery(dbConfig3, query, []);
    }
   
    if(data){
        const TenderData=await getTenderNo(TenderId);
        //console.log("TD Data",TenderData)
        return {TenderData};
    }
    return {message:"Error while inserting or updating."};
}

const checkDuplicateEntry=async(payload)=>{
    const {
        TenderId
    }=payload;

    const query=`select * from 
    TenderBidLists 
    where TenderId=${TenderId}`;

    const data = await getData(dbConfig3, query);

    if(data.length){
        return true;
    }else{
        return false;
    }

}

const getTenderNo=async(TenderId)=>{
    if(TenderId){
        const query = `select TenderNo from Tender where TenderId=${TenderId}`;
        const data = await getData(dbConfig3, query);

        if(data){
            return data;
        }else{
            return 0;
        }
    }else{
        return 0;
    }
}

const insertTenderUsers=async(lists)=>{
    const newLists=[...lists];

    const query=`DECLARE @json NVARCHAR(MAX) = '${JSON.stringify(newLists)}';

    CREATE TABLE #TempPosts
    (
        TenderBidId int,
        TenderId int,
        TenderUserId int,
        CreatedBy int
    );
    
    -- Insert data into the temporary table using OPENJSON
    INSERT INTO #TempPosts (TenderBidId,TenderId,TenderUserId, CreatedBy)
    SELECT 
        JSON_VALUE(value, '$.TenderBidId') AS TenderBidId,
        JSON_VALUE(value, '$.TenderId') AS TenderId,
        JSON_VALUE(value, '$.TenderUserId') AS TenderUserId,
        JSON_VALUE(value, '$.CreatedBy') AS CreatedBy
    FROM OPENJSON(@json);
    
    -- Insert data from the temporary table into your target table
    INSERT INTO TenderUserMap (TenderBidId,TenderId,TenderUserId, CreatedBy)
    SELECT TenderBidId,TenderId,TenderUserId,CreatedBy
    FROM #TempPosts;
    
    -- Drop the temporary table
    DROP TABLE #TempPosts`;

    const data = await executeQuery(dbConfig3, query,[]);
   
    //console.log(data)
    if(data){
        return {data};
    }

}

module.exports = create_new_tender_publish_services;