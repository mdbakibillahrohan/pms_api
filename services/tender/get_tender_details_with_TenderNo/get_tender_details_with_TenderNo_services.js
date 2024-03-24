

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getTenderListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    let obj={};
    if(data.length){
        obj={...data[0]};

        if(obj?.details){
           // console.log("Heloooo")
            obj={
                ...obj,
                details:JSON.parse(obj.details)
            }
            if(obj.details?.length){
                const details=obj.details;

                details.map((dta,index)=>{
                    let newGrade;
                    try{
                        newGrade=JSON.parse(dta.Grades);
                    }catch{
                        newGrade={}
                    }
                    const newObj={
                        ...dta,
                        Grades:newGrade.length?newGrade[0]:{}
                    }
                    obj.details[index]=newObj
                })
            }
        }
    }

    return {lists: obj};
}

const getTenderLists = async (payload)=>{
    const {
        TenderNo
    }=payload;
    const query = `select 
    ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
    A.TenderId,A.TenderNo,A.TenderTitle,A.TenderDescription,A.TotalAmount,A.TenderAttachment,
    (
    case when DATEDIFF(second,TBL.OpenDate,GETDATE())>1 and DATEDIFF(second,TBL.CloseDate,GETDATE())<1 and TBL.IsSale=0 then 'On Going'
    when DATEDIFF(second,TBL.OpenDate,GETDATE())<1 and DATEDIFF(second,TBL.CloseDate,GETDATE())<1 and TBL.IsSale=0 then 'Open Soon'
    when DATEDIFF(second,GETDATE(),TBL.OpenDate)<1 and DATEDIFF(second,GETDATE(),TBL.CloseDate)<1 and TBL.IsSale=0 then 'TimeOver'
    else 'Not Publish'
    end
    ) as Status,
    (
        Select 
        ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
        BB.ItemId,BB.ItemName,BB.ItemRemarks,BB.UnitOfMeasurement,BB.ItemQuantity,BB.ItemRate as lastRate,BB.LastBidDate,BB.TargetRate as ItemRate,BB.ItemValue,
		(
		case when TG.TenderGradeId is not null then (select TenderGradeId as [key],TenderGradeId as [value] ,GradeName as [label] from TenderGrade where TenderGradeId=TG.TenderGradeId for json path)
		else '' end
		) as Grades
        from Tender AA 
        inner join TenderItems BB on AA.TenderId=BB.TenderId
		left join TenderGrade TG on BB.TenderGradeId=TG.TenderGradeId
        where AA.TenderId=A.TenderId and BB.IsDeleted=0 for json path
    ) as details
    from Tender A
    left join TenderBidLists TBL on A.TenderId=TBL.TenderId
    where A.TenderNo='${TenderNo}' and A.IsDeleted=0`;
    const data = await getData(dbConfig3, query);
    return data; 
}



module.exports = getTenderListsServices;