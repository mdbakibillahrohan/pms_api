

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getBiddingListsReportServices = async (payload)=>{
    const data = await getTenderDetails(payload);
    //const count=await getCount(payload);
    //console.log(data.length)
    if(data.length){
        return {data: JSON.parse(data[0].data)};
    }else{
        return {data:[]};;
    }
}

const getTenderDetails = async (payload)=>{
    const {TenderNo}=payload;

    const query = `select(SELECT
    B.TenderNo,
    A.OpenDate,
    A.CloseDate,
    CASE
        WHEN DATEDIFF(SECOND, A.OpenDate, GETDATE()) > 1 AND DATEDIFF(SECOND, DATEADD(MINUTE, ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId = A.TenderBidId), 0), A.CloseDate), GETDATE()) < 1 THEN 1
        WHEN DATEDIFF(SECOND, A.OpenDate, GETDATE()) < 1 AND DATEDIFF(SECOND, DATEADD(MINUTE, ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId = A.TenderBidId), 0), A.CloseDate), GETDATE()) < 1 THEN 2
        ELSE 3
    END AS TimeStatus,
    CASE
        WHEN DATEDIFF(SECOND, A.OpenDate, GETDATE()) > 1 AND DATEDIFF(SECOND, DATEADD(MINUTE, ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId = A.TenderBidId), 0), A.CloseDate), GETDATE()) < 1 THEN DATEDIFF(SECOND, GETDATE(), DATEADD(MINUTE, ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId = A.TenderBidId), 0), A.CloseDate))
        WHEN DATEDIFF(SECOND, A.OpenDate, GETDATE()) < 1 AND DATEDIFF(SECOND, DATEADD(MINUTE, ISNULL((SELECT SUM(K.Minutes) FROM TimerLogs K WHERE K.TenderBidId = A.TenderBidId), 0), A.CloseDate), GETDATE()) < 1 THEN DATEDIFF(SECOND, GETDATE(), A.OpenDate)
        ELSE 0
    END AS Times,
    (
        SELECT
            A.ItemId,
            A.ItemName + ' ' + A.ItemRemarks AS ItemName,
            ISNULL(E.GradeName, 'N/A') AS GradeName,
            A.UnitOfMeasurement,
            A.ItemQuantity,
            A.ItemRate AS LastPrice,
            A.LastBidDate,
            C.TenderUserId,
            D.CompanyName,
            D.CompanyPhone,
            D.CompanyEmail,
            (
				SELECT TOP 1 BidPrice FROM BiddingDetails WHERE ItemId=C.ItemId AND TenderUserId=C.TenderUserId ORDER BY CreatedAt DESC
			) AS BidPrice,
            (
                SELECT MAX(BD.BidPrice)
                FROM BiddingDetails BD
                JOIN (
                    SELECT TenderUserId, MAX(CreatedAt) AS MaxCreatedAt
                    FROM BiddingDetails
                    WHERE ItemId = C.ItemId
                    GROUP BY TenderUserId
                ) AS MaxDates ON BD.TenderUserId = MaxDates.TenderUserId AND BD.CreatedAt = MaxDates.MaxCreatedAt
                WHERE BD.ItemId = C.ItemId
            ) AS TopPrice,
            (
                SELECT TOP 1 BB.CompanyName
                FROM TenderUsers BB
                INNER JOIN BiddingDetails TT ON BB.TenderUserId = TT.TenderUserId
                WHERE TT.ItemId = C.ItemId and TT.BidPrice=ISNULL((
                SELECT MAX(BD.BidPrice)
                FROM BiddingDetails BD
                JOIN (
                    SELECT TenderUserId, MAX(CreatedAt) AS MaxCreatedAt
                    FROM BiddingDetails
                    WHERE ItemId = C.ItemId
                    GROUP BY TenderUserId
                ) AS MaxDates ON BD.TenderUserId = MaxDates.TenderUserId AND BD.CreatedAt = MaxDates.MaxCreatedAt
                WHERE BD.ItemId = C.ItemId
            ),0)
                ORDER BY BB.CreatedAt desc
            ) AS Winner
        FROM TenderItems A
        INNER JOIN Tender B ON A.TenderId = B.TenderId
        INNER JOIN BiddingDetails C ON A.ItemId = C.ItemId
        LEFT JOIN TenderGrade E ON A.TenderGradeId = E.TenderGradeId
        INNER JOIN TenderUsers D ON C.TenderUserId = D.TenderUserId
        WHERE B.TenderNo = '${TenderNo}'
        GROUP BY A.ItemId, C.TenderUserId, C.ItemId,A.ItemName, A.ItemRemarks, A.ItemId, E.GradeName, A.ItemRate, A.LastBidDate, A.UnitOfMeasurement, A.ItemQuantity, C.TenderUserId, D.CompanyName, D.CompanyPhone, D.CompanyEmail
        FOR JSON PATH
    ) AS lists
FROM TenderBidLists A
INNER JOIN Tender B ON A.TenderId = B.TenderId
WHERE B.TenderNo = '${TenderNo}' for json path) as data`;
    const data = await getData(dbConfig3, query);
    return data; 
}

module.exports = getBiddingListsReportServices;