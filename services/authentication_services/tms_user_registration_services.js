const { 
    getData, 
    executeQuery 
} = require('../../util/dao');
const { 
    dbConfig3 
} = require('../../util/settings');
const ConvertPassString=require('../../util/convertPass')

const tmsUserRegistrationServices = async(payload)=>{
    const checkDuplicate=await checkDuplicateEntry(payload);
    if(checkDuplicate===1){
        return {IsEntry:true,message:"User Exists."};
    }else{
        const data = await newUserEntry(payload);
        return data;
    }
}

const checkDuplicateEntry=async(payload)=>{
    const {
        CompanyEmail,
        CompanyPhone
    }=payload;

    const query=`Select * from 
    TenderUsers where CompanyEmail='${CompanyEmail}' or CompanyPhone='${CompanyPhone}'`;

    const data = await getData(dbConfig3, query);

    //console.log("Data : ",data)
    if(data.length){
        return 1;
    }else{
        return 0;
    }

}

const newUserEntry = async(payload)=>{
    const {
        CompanyName, 
        CompanyEmail,
        CompanyPhone, 
        CompanyAddress, 
        Password
    } = payload;
    const ConvertPass=ConvertPassString(Password);

    const query = `insert into TenderUsers (CompanyName,CompanyEmail,CompanyPhone,CompanyAddress,Password) 
    values(@CompanyName,@CompanyEmail,@CompanyPhone,@CompanyAddress,@Password);`;
    const params = [
        {
            name: "CompanyName",
            value: CompanyName
        },
        {
            name: "CompanyEmail",
            value: CompanyEmail
        },
        {
            name: "CompanyPhone",
            value: CompanyPhone
        },
        {
            name: "CompanyAddress",
            value: CompanyAddress
        },
        {
            name: "Password",
            value: ConvertPass
        }
    ];
    const data = await executeQuery(dbConfig3, query, params);
    if(data){
        return {message:"success"};
    }
    return {message:"Error while inserting"};
}


module.exports = tmsUserRegistrationServices;