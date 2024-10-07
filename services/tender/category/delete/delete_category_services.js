const {
    executeQuery
}=require('../../../../util/dao');
const {
    dbConfig3
}=require('../../../../util/settings');



// delete category main services
const delete_category_services=async(payload)=>{
    const{
        CategoryId
    }=payload;

    if(CategoryId){
        
        const data=await delete_category(payload);

        if(data){
            return {message:"Success",data:data}
        }else{
            return {message:"Error",data:[]};
        }
    }
}


// delete category method
const delete_category=async(payload)=>{
    const {
        CategoryId
    }=payload;

    const query=`DECLARE @ReturnValue INT;
            exec @ReturnValue=sp_create_update_delete_category
            @category_id=${CategoryId},
            @action_type='delete';
            select @ReturnValue as RowsAffected
        `;

    const data=await executeQuery(dbConfig3,query,[]);

    if(data){
        return {data};
    }
    return {message:"Error while inserting or updating."};
}

module.exports=delete_category_services