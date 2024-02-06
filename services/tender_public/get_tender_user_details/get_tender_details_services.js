

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderUserDetailsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    //console.log(data)
    if(data.length){
        return {data};
    }else{
        return []
    }
}

const getTenderLists = async (payload)=>{
    const {
        CompanyEmail,
        TenderUserId
    }=payload;
    const query = `Select TenderUserId,CompanyName,CompanyEmail,CompanyPhone,CompanyAddress
    from TenderUsers where TenderUserId=${TenderUserId} and CompanyEmail='${CompanyEmail}' and IsApproved=1`;
    const data = await getData(dbConfig3, query);
    return data; 
}

module.exports = getTenderUserDetailsServices;