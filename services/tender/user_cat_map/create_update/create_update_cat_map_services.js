const {
    dbConfig3
}=require("../../../../util/settings");
const {
    executeQuery
}=require('../../../../util/dao');



const create_update_cat_map_services=async(payload)=>{
    const data=await create_or_update(payload);

    if(data){
        return {data:data,message:'success'};
    }else{
        return {message:'error',data:[]}
    }
}

const create_or_update=async(payload)=>{
    const {
        MaxLen,
        UserCatLists
    }=payload;

    const query=`DECLARE @ReturnValue INT;
        exec @ReturnValue=sp_user_cat_map
        @action_type='insert_or_update',
        @max_idx=${MaxLen},
        @cat_json='${JSON.stringify(UserCatLists)}';
        select @ReturnValue as RowsAffected;
    `;


    const data=await executeQuery(dbConfig3,query,[]);
    if(data){
        return {data};
    }else{
        return {message:'Error while update or create.'};
    }
}

module.exports=create_update_cat_map_services;