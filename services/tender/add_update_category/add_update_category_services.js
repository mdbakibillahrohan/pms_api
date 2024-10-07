const { 
    executeQuery
} = require('../../../util/dao');

const { 
    dbConfig3 
} = require('../../../util/settings');

const add_update_category_services = async(payload)=>{
    const {
        ip,
        body
    }=payload;

    const {
        CategoryId
    }=body;


    if(CategoryId){
        const data = await update_existing_category(body);
        if(data){
            return {message:"success",data:data};
        }else{
            return {message:"success",data:[]};
        }
    }else{
        const data = await insert_new_category(body);
        if(data){
            return {message:"success",data:data};
        }else{
            return {message:"success",data:[]};
        }
    }
    
}

const insert_new_category = async(payload)=>{
    const {
        CategoryName,
        CategoryDescription,
        CreatedBy
    }=payload;


    let data;
    // const procedureName = `sp_create_update_delete_category`;
    // const params = [
    //     {
    //         name: "category_name",
    //         value: CategoryName
    //     },
    //     {
    //         name: "category_description",
    //         value: CategoryDescription
    //     },
    //     {
    //         name: "created_by",
    //         value: CreatedBy
    //     },
    //     {
    //         name: "action_type",
    //         value: 'create'
    //     }
    // ];
    // console.log("DYT:: ",payload)
    // data = await executeStoreProcedure(dbConfig3, procedureName, params);
    const query=`DECLARE @ReturnValue INT;
    exec @ReturnValue=sp_create_update_delete_category 
        @action_type='create',
        @category_name=N'${CategoryName}',
        @category_description=N'${CategoryDescription}',
        @created_by=${CreatedBy};
        select @ReturnValue as RowsAffected
    `;

    data=await executeQuery(dbConfig3,query,[])
    if(data){
        return {data};
    }
    return {message:"Error while inserting or updating."};
}
const update_existing_category = async(payload)=>{
    const {
        CategoryId,
        CategoryName,
        CategoryDescription,
        CreatedBy
    }=payload;


    let data;
    // const procedureName = `sp_create_update_delete_category`;
    // const params = [
    //     {
    //         name: "action_type",
    //         value: 'update'
    //     },
    //     {
    //         name: "category_name",
    //         value: CategoryName
    //     },
    //     {
    //         name: "category_description",
    //         value: CategoryDescription
    //     },
    //     {
    //         name: "created_by",
    //         value: CreatedBy
    //     },
    //     {
    //         name: "category_id",
    //         value: CategoryId
    //     }
    // ];

    const query=`DECLARE @ReturnValue INT;
    exec @ReturnValue=sp_create_update_delete_category 
        @action_type='update',
        @category_name=N'${CategoryName?CategoryName:""}',
        @category_description=N'${CategoryDescription?CategoryDescription:""}',
        @created_by=${CreatedBy},
        @category_id=${CategoryId};

        select @ReturnValue as RowsAffected
        `

    data=await executeQuery(dbConfig3,query,[])
   
    if(data){
        return {data};
    }
    return {message:"Error while inserting or updating."};
}




module.exports = add_update_category_services;