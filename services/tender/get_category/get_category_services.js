const {
    getData
}=require('../../../util/dao');
const {
    dbConfig3
}=require('../../../util/settings');

// fetch category main services.
const get_category_services=async(payload)=>{
    const {
        Take,
        Skip
    }=payload;

    if(Take || Skip){
       
        let take=Take;
        let skip=Skip;

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

        const data=await fetch_with_filter({Take:take,Skip:skip});

       
        if(data?.length){
            return {lists:data}
        }
    }else{
        const data=await fetch_all();

       
        if(data?.length){
            return {lists:data}
        }
    }
}

// fetch category lists with pagination
const fetch_with_filter=async(payload)=>{
    const {
        Take,
        Skip
    }=payload;

    const query=`exec sp_create_update_delete_category 
    @action_type='feth_with_filter',@take=${Take},@skip=${Skip}`;

    const data=await getData(dbConfig3,query);

    return data;
}

// fetch all category
const fetch_all=async()=>{
    const query=`exec sp_create_update_delete_category 
    @action_type='fetch_all'`;

    const data=await getData(dbConfig3,query);

    return data;
}

module.exports=get_category_services;