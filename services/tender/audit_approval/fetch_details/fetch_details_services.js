const {dbConfig3}=require('../../../../util/settings');
const {getData}=require('../../../../util/dao');

const fetch_details_services=async(payload)=>{
    const data=await get_all(payload);
    if(data?.length){
        return {lists:data}
    }else{
        return {lists:[]}
    }
}

const get_all=async(payload)=>{
    const {TenderNo}=payload;

    const  query=`exec sp_audit_approval @action_type='fetch_details',@TenderNo='${TenderNo}'`;

    const data=await getData(dbConfig3,query);

    return data;
}

module.exports=fetch_details_services;