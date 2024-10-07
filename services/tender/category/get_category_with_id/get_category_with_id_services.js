const {
    getData
}=require('../../../../util/dao');
const {
    dbConfig3
}=require('../../../../util/settings');


const get_category_with_id_services=async(payload)=>{
    const data=await get_data(payload);

    if(data?.length){
        return {lists:data,message:'success'}
    }else{
        return {lists:[],message:'error'}
    }
}
const get_data=async(paylaod)=>{
    const {
        CategoryId
    }=paylaod;

    const query=`exec sp_create_update_delete_category 
    @action_type='fetch_by_id',
    @category_id=${CategoryId};`;

    const data=getData(dbConfig3,query);

    return data;
}

module.exports=get_category_with_id_services;