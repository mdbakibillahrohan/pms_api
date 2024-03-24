const { 
    getData, 
    executeQuery,
    executeQueryWithReturnId
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const create_new_timer_for_tender = async(payload)=>{
    const {
        ip,
        body
    }=payload;

    const {
        TenderBidId,
        Minutes,
        IsFromBidding,
        CreatedBy
    }=body;

    const ClientIp=getExactIpAddress(ip);
    
    const payloadData={
        TenderBidId,
        Minutes,
        IsFromBidding,
        UserTerminalId:ClientIp,
        CreatedBy
    }

    const data = await insertNewTimer(payloadData);
    if(data){
        return {message:"success",data:data};
    }else{
        return 0;
    }
}

const insertNewTimer = async(payload)=>{
    const {
        TenderBidId,
        Minutes,
        IsFromBidding,
        UserTerminalId,
        CreatedBy
    } = payload;


    let data;
    const query = `Insert into TimerLogs (TenderBidId,Minutes,IsFromBidding,UserTerminalId,CreatedBy) 
    values(@TenderBidId,@Minutes,@IsFromBidding,@UserTerminalId,@CreatedBy)`;
    const params = [
        {
            name: "TenderBidId",
            value: TenderBidId
        },
        {
            name: "Minutes",
            value: Minutes
        },
        {
            name: "IsFromBidding",
            value: IsFromBidding
        },
        {
            name: "UserTerminalId",
            value: UserTerminalId
        },
        {
            name: "CreatedBy",
            value: CreatedBy
        }
    ];
    data = await executeQuery(dbConfig3, query, params);
   
    if(data){
        return {data};
    }
    return {message:"Error while inserting or updating."};
}

const getExactIpAddress=(ip_address)=>{
    let newIp=ip_address;

    if(newIp){
        newIp=newIp.split (":");
        if(newIp.length){
            const len=newIp.length;

            newIp=newIp[len-1];
            return newIp;
        }else{
            return 0;
        }
    }else{
        return 0;
    }
}


module.exports = create_new_timer_for_tender;