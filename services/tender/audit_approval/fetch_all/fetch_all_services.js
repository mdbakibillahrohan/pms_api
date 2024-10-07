const {dbConfig3}=require('../../../../util/settings');
const {getData}=require('../../../../util/dao');

const fetch_all_services=async(payload)=>{
    const {
        Take,
        Skip
    }=payload;

    let take,skip;

    if(Take){
        take=take;
    }else{
        take=0
    }

    if(Skip){
        skip=Skip;
    }else{
        skip=0;
    }

    if(take || skip){
        const data=await get_all_with_filter({take:take,skip:skip});

        if(data?.length){
            return {message:'sucess',lists:data}
        }else{
            return {message:'empty',lists:[]}
        }
    }else{
        const data=await get_all();
        if(data?.length){
            return {message:'sucess',lists:data}
        }else{
            return {message:'empty',lists:[]}
        }
    }
}

const get_all=async()=>{
    const query=`exec sp_audit_approval @action_type='fetch_all';`;

    const data=await getData(dbConfig3,query);

    return data;
}
const get_all_with_filter=async(paylaod)=>{

}

module.exports=fetch_all_services;