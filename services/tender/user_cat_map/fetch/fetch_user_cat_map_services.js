const {dbConfig3}=require("../../../../util/settings");
const {getData}=require("../../../../util/dao");


const fetch_user_cat_map_services=async(payload)=>{
    const data=await get_lists(payload);

    if(data?.length){
        return {lists:data}
    }else{
        return {lists:[]}
    }
}

const get_lists=async(payload)=>{
    const {
        TenderUserId
    }=payload;


    const query=`exec sp_user_cat_map @action_type='get_all',@tender_user_id1=${parseInt(TenderUserId)};`;

    const data=await getData(dbConfig3,query,[]);

    return data;

}

module.exports=fetch_user_cat_map_services;