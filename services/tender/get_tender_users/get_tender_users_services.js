

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderUserListsServices = async (payload)=>{
    let myLists=[];
    const data = await getTenderUserLists(payload);
    if(data.length){
        myLists=data[0].data
    }
    //console.log(myLists)
    const count=await getCount(payload);
    return {count:count,lists: JSON.parse(myLists)};
}

const getTenderUserLists = async (payload)=>{
    const {
        Take,
        Skip,
        FilterType
    }=payload;
    let partialQuery='';

    if(FilterType==1){
        partialQuery='where A.IsApproved=1';
    }else if(FilterType==0){
        partialQuery='where A.IsApproved=0';
    }else if(FilterType==3){
        partialQuery='where A.IsDeleted=1';
    }else if(FilterType==5){
        partialQuery='';
    }
    const query = `select(
        select 
          ROW_NUMBER() OVER (order by(select 1)) as [key],
          TenderUserId,
          CompanyName,
          CompanyEmail,
          (case when IsApproved=1 then 1
          else 0
          end
          ) as [Status],
          (select
          B.TenderUserId as [key],
          B.CompanyAddress,
          (
          case when B.ApprovedBy is not null then C.FirstName
          else 'Not Approved'
          end
          ) as ApprovedBy
          from 
          TenderUsers B 
          left join Users C on B.ApprovedBy=C.UserId
          where B.TenderUserId=A.TenderUserId
          for json path
          ) as details
        from TenderUsers A ${partialQuery} order by A.TenderUserId desc OFFSET ${Skip} ROWS 
        FETCH NEXT ${Take} ROWS ONLY for json path
        ) as data`;
    const data = await getData(dbConfig3, query);
    return data; 
}

const getCount = async(payload)=>{
    const {
        FilterType
    }=payload;

    let partialQuery='';

    if(FilterType==1){
        partialQuery='where IsApproved=1';
    }else if(FilterType==0){
        partialQuery='where IsApproved=0';
        //console.log("Calleddd")
    }else if(FilterType==3){
        partialQuery='where IsDeleted=1';
    }else if(FilterType==5){
        partialQuery='';
    }
    //console.log("Partial Query: ",partialQuery,FilterType);
    const query = `select IsNull(count(TenderUserId),0) as count from TenderUsers ${partialQuery}`;
    const data = await getData(dbConfig3, query);
    return data[0].count;
}


module.exports = getTenderUserListsServices;