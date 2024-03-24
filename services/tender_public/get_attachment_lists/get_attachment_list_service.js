

const { 
    getData 
} = require('../../../util/dao');
const { 
    dbConfig3 
} = require('../../../util/settings');

const getAttachmentListServices = async (payload)=>{
    const data = await getTenderAttachmentLists(payload);
    return {lists:data };
}

const getTenderAttachmentLists = async (payload)=>{
    const query = `select AttachmentId as [key] , AttachmentId,AttachmentName,AttachmentSlug from Attachment`;
    const data = await getData(dbConfig3, query);
    return data; 
}

module.exports = getAttachmentListServices;