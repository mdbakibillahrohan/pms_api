

const { getData } = require('../../../util/dao');
const { dbConfig3 } = require('../../../util/settings');

const getLastEntryTenderIdServices = async (payload)=>{
    const data = await getLastEntryTenderId(payload);
    if(data.length){
        return data[0].TenderId
    }else{
        return 5000;
    }
}

const getLastEntryTenderId = async (payload)=>{
    const {filterDate}=payload;
    const query = `select 
    Count(TenderId) as TenderId
    from Tender where Cast(CreatedAt as date)=cast('${filterDate}' as date) order by TenderId desc`;
    
    const data = await getData(dbConfig3, query);
    //console.log(data)
    return data; 
}



module.exports = getLastEntryTenderIdServices;