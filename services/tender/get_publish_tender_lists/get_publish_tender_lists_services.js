

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getPublishedTenderListsServices = async (payload)=>{
    const data = await getTenderLists(payload);
    // if(data.length){
    //     myLists=data[0].data
    // }
    //console.log(myLists)
    const count=await getCount(payload);
    return {count:count,lists: data};
}

const getTenderLists = async (payload)=>{
    const {
        UserId,
        Take,
        Skip
    }=payload;
    const query = `SELECT 
        ROW_NUMBER() OVER (ORDER BY (SELECT 1)) AS [key],
        A.TenderBidId,
        A.Description,
        B.TenderNo,
        B.TenderNo + ' - ' + B.TenderTitle AS TenderNoTitle,
        B.MinimumBidAmount,
        A.OpenDate,
        DATEADD(MINUTE, ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId = A.TenderBidId), 0), A.CloseDate) AS CloseDate,
        CASE 
            WHEN DATEDIFF(second, A.OpenDate, GETDATE()) > 1 
                AND DATEDIFF(second, DATEADD(MINUTE, ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId = A.TenderBidId), 0), A.CloseDate), GETDATE()) < 1 
                AND A.IsSale = 0 THEN 'On Going'
            WHEN DATEDIFF(second, A.OpenDate, GETDATE()) < 1 
                AND DATEDIFF(second, DATEADD(MINUTE, ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId = A.TenderBidId), 0), A.CloseDate), GETDATE()) < 1 
                AND A.IsSale = 0 THEN 'Open Soon'
            WHEN DATEDIFF(second, GETDATE(), A.OpenDate) < 1 
                AND DATEDIFF(second, GETDATE(), DATEADD(MINUTE, ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId = A.TenderBidId), 0), A.CloseDate)) < 1 
                AND A.IsSale = 1 THEN 'Sold'
            ELSE 'Time Over'
        END AS [Status],
        (
            SELECT B2.TenderUserId, B2.CompanyName 
            FROM TenderUserCatMap A2
            INNER JOIN TenderUsers B2 ON B2.TenderUserId = A2.TenderUserId
            WHERE A2.TenderCatId = B.CategoryId  and A2.IsActive=1
            FOR JSON PATH
        ) AS users
    FROM 
        TenderBidLists A
    INNER JOIN 
        Tender B ON A.TenderId = B.TenderId
    WHERE 
        A.IsDeleted = 0 
    GROUP BY 
        A.TenderBidId, A.Description, B.TenderNo, B.TenderTitle, B.MinimumBidAmount,B.CategoryId, A.OpenDate, A.CloseDate, A.IsSale
    ORDER BY 
        A.TenderBidId DESC 
    OFFSET ${Skip} ROWS 
    FETCH NEXT ${Take} ROWS ONLY;
    `;
    const data = await getData(dbConfig3, query);
    return data; 
}

const getCount = async()=>{
    const query = `select Count(TenderBidId) as [count] from TenderBidLists where IsDeleted=0`;
    const data = await getData(dbConfig3, query);
    return data[0].count;
}


module.exports = getPublishedTenderListsServices;