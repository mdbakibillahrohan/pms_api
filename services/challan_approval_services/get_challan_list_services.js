const { TABLE } = require("../../util/constant");
const { getData } = require("../../util/dao");
const { dbConfig } = require("../../util/settings");

const getChallanListServices = async (payload) => {
    const { challan_type } = payload;
    let data = null;
    const count = getCount(payload);
    if (challan_type === "sewing") {
        data = await getSewingChallanList(payload);
    } else {
        data = await getWashChallanList(payload);
    }
    return {
        count,
        data
    };
};

const getSewingChallanList = async (payload) => {
    const { search_text, limit, offset } = payload;
    const partialQuery = getPartialQuery(payload);

    let parameters = [];
    let query = `select nsc.SCId ChallanId, nsc.ChallanNo, nsc.ChallanDate, nsc.TotalGmtQty, 
    ufr.UnitFullName FromUnit, uto.UnitFullName ToUnit 
    from ${TABLE.NEW_SEWING_CHALLAN} nsc 
    inner join Unit ufr on ufr.UnitId = nsc.FromUnitId
    inner join Unit uto on uto.UnitId = nsc.ToUnitId
    where 1 = 1 and ${partialQuery} and nsc.ChallanDate is not null`;

    if (search_text) {
        query += ` and ChallanNo like @SearchText`;
        parameters.push({
            name: "SearchText",
            value: search_text,
        });
    }

    query += ` order by nsc.CreatedAt desc`;

    if (offset && limit) {
        query += ` offset @Offset ROWS
        fetch next @Limit rows only`;

        parameters.push(
            {
                name: "Offset",
                value: offset,
            },
            {
                name: "Limit",
                value: limit,
            }
        );
    }
    const data = await getData(dbConfig, query, parameters);
    return data;
};

const getWashChallanList = async (payload) => {
    const { search_text, limit, offset } = payload;
    const partialQuery = getPartialQuery(payload);

    let parameters = [];
    let query = `select nwcm.WCMId ChallanId, nwcm.ChallanNo, nwcm.ChallanDate, nwcm.TotalGmtQty, 
    ufr.UnitFullName FromUnit, uto.UnitFullName ToUnit 
    from ${TABLE.NEW_WASH_CHALLAN} nwcm 
    inner join Unit ufr on ufr.UnitId = nwcm.FromUnitId
    inner join Unit uto on uto.UnitId = nwcm.ToUnitId
    where 1 = 1 and ${partialQuery} and and nwcm.ChallanDate is not null`;

    if (search_text) {
        query += ` and nwcm.ChallanNo like @SearchText`;
        parameters.push({
            name: "SearchText",
            value: search_text,
        });
    }

    query += ` order by nwcm.CreatedAt desc`;

    if (offset && limit) {
        query += ` offset @Offset ROWS
        fetch next @Limit rows only`;

        parameters.push(
            {
                name: "Offset",
                value: offset,
            },
            {
                name: "Limit",
                value: limit,
            }
        );
    }
    const data = await getData(dbConfig, query, parameters);
    return data;
};

const getPartialQuery = (payload) => {
    const { list_type, approver_stack } = payload;
    let partialQuery = null;

    if (list_type === "waiting") {
        switch (approver_stack) {
            case "RDC":
                partialQuery = `RDCUserId = 0`;
                break;
            case "ApprovedBy":
                partialQuery = `ApprovedByUserId = 0`;
                break;
            case "CheckedBy":
                partialQuery = `CheckedByUserId = 0`;
                break;
        }
    } else {
        switch (approver_stack) {
            case "RDC":
                partialQuery = `RDCUserId = ${approver_id}`;
                break;
            case "ApprovedBy":
                partialQuery = `ApprovedByUserId = ${approver_id}`;
                break;
            case "CheckedBy":
                partialQuery = `CheckedByUserId = ${approver_id}`;
                break;
        }
    }
    return partialQuery;
};

const getCount = async(payload) => {
    const { challan_type } = payload;
    let query = null;
    let parameters = [];
    const { search_text } = payload;
    const partialQuery = getPartialQuery(payload);

    if (challan_type === "sewing") {
        query = `select count(nsc.SCId) count from ${TABLE.NEW_SEWING_CHALLAN} nsc
        where 1 = 1 and ${partialQuery} and nsc.ChallanDate is not null`;

        if (search_text) {
            query += ` and nsc.ChallanNo like @SearchText`;
            parameters.push({
                name: "SearchText",
                value: search_text,
            });
        }
    } else {
        query = `select count(nwcm.WCMId) count from ${TABLE.NEW_WASH_CHALLAN} nwcm
        where 1 = 1 and ${partialQuery} and and nwcm.ChallanDate is not null`;

        if (search_text) {
            query += ` and nwcm.ChallanNo like @SearchText`;
            parameters.push({
                name: "SearchText",
                value: search_text,
            });
        }
    }
    const data = await getData(dbConfig, query, parameters);
    return data[0].count;
}
module.exports = getChallanListServices;
