const { executeQuery } = require('../../util/dao');
const { dbConfig } = require('../../util/settings');
const { TABLE } = require('../../util/constant');
const rejectChallanServices = async (payload) => {
    const data = await rejectChallan(payload);
    return data;
}

const rejectChallan = async (payload) => {
    const { userInfo } = payload;
    if (userInfo.TypeName.includes("ApprovedBy")) {
        const updateChallan = await updateChallanTable(payload);
        if (updateChallan) {
            const insert = await insertRejectHistory(payload);
            if (insert) {
                return {
                    message:"Success"
                };
            }
            return {
                message: "Failed to insert data"
            };
        }
        return {
            message: "Failed to update and insert data"
        };
    }else{
        return {
            message: "You don't have permission"
        }
    }

}

const updateChallanTable = async (payload) => {
    const { challan_type, challan_id } = payload;
    const { UserId } = payload.userInfo;
    let query = null;

    if (challan_type === "sewing") {
        query = `update ${TABLE.NEW_SEWING_CHALLAN} set IsReject = 1, RejectorId = ${UserId} where SCId = ${challan_id}`;
    } else {
        query = `update ${TABLE.NEW_WASH_CHALLAN} set IsReject = 1, RejectorId = ${UserId} where WCMId = ${challan_id}`;
    }
    const data = await executeQuery(dbConfig, query);
    return data;
}

const insertRejectHistory = async (payload) => {
    const { challan_type, challan_id, remarks } = payload;
    const { UserId } = payload.userInfo;
    let query = null;

    if (challan_type === "sewing") {
        query = `insert into ${TABLE.SEWING_CHALLAN_REJECT_HISTORY}(UserId, SCId, Remarks)
                    values(${UserId}, ${challan_id}, @Remarks)`;
    } else {
        query = `insert into ${TABLE.WASH_CHALLAN_REJECT_HISTORY}(UserId, WCMId, Remarks)
                    values(${UserId}, ${challan_id}, @Remarks)`;
    }
    const parameters = [
        {
            name: "Remarks",
            value: remarks
        }
    ];
    const data = await executeQuery(dbConfig, query, parameters);
    return data;
}

module.exports = rejectChallanServices;