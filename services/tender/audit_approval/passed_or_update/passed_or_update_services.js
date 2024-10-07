const {dbConfig3}=require("../../../../util/settings");
const {executeQuery}=require('../../.././../util/dao');


const passed_or_update_services=async(paylaod)=>{
    const {
        ChekedStatus
    }=paylaod;

    if(ChekedStatus===100){
       // console.log
        const data=await update_quantity(paylaod);

        if(data){
            return {data:data,message:'success'};
        }else{
            return {data:[],message:'error'};
        }
    }else if(ChekedStatus===200){
        const data=await passed_tender(paylaod);

        if(data){
            return {data:data,message:'success'};
        }else{
            return {data:[],message:'error'};
        }
    }
}

const passed_tender=async(payload)=>{
    const {
        TenderNo,
        Items,
        UserId
    }=payload;

    const len=Items.length;
    const query=`DECLARE @ReturnValue INT;
        exec @ReturnValue=sp_audit_approval 
        @action_type='check_audit',
        @TenderNo=${TenderNo},
        @max_idx=${len},
        @user_id=${UserId},
        @item_json='${JSON.stringify(Items)}';
        select @ReturnValue as RowsAffected;
    `;

    const data=await executeQuery(dbConfig3,query,[]);

    if(data){
        return {data};
    }else{
        return {message:'Error while update or create.'};
    }
}

const update_quantity=async(paylaod)=>{
    const {
        TenderNo,
        Items,
        UserId
    }=paylaod;

    const len=Items.length;
    const query=`DECLARE @ReturnValue INT;
        exec @ReturnValue=sp_audit_approval 
        @action_type='quantity_update',
        @TenderNo=${TenderNo},
        @max_idx=${len},
        @user_id=${UserId},
        @item_json='${JSON.stringify(Items)}';
        select @ReturnValue as RowsAffected;
    `;

    const data=await executeQuery(dbConfig3,query,[]);

    if(data){
        return {data};
    }else{
        return {message:'Error while update or create.'};
    }
}

module.exports=passed_or_update_services;