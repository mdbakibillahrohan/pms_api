const { 
    getData, 
    executeQuery 
} = require('../../util/dao');
const { 
    dbConfig3 
} = require('../../util/settings');
const ConvertPassString=require('../../util/convertPass')

const tmsRegistrationServices = async(payload)=>{
    const checkDuplicate=await checkDuplicateEntry(payload);
    if(checkDuplicate===1){
        return {IsEntry:true,message:"User Exists."};
    }else{
        const data = await newUserEntry(payload);
        return data;
    }
}

const checkDuplicateEntry=async(payload)=>{
    const {Email}=payload;

    const query=`select * from Users 
    where Email='${Email}'`;

    const data = await getData(dbConfig3, query);

    //console.log("Data : ",data)
    if(data.length){
        return 1;
    }else{
        return 0;
    }

}

const newUserEntry = async(payload)=>{
    const {FirstName, LastName,Email, Phone, Password,PresentAddress,PermanentAddress} = payload;
    const ConvertPass=ConvertPassString(Password);

    const query = `insert into Users (FirstName,LastName,Email,Phone,Password,PresentAddress,PermanentAddress) 
    values(@FirstName,@LastName,@Email,@Phone,@Password,@PresentAddress,@PermanentAddress);`;
    const params = [
        {
            name: "FirstName",
            value: FirstName
        },
        {
            name: "LastName",
            value: LastName
        },
        {
            name: "Email",
            value: Email
        },
        {
            name: "Phone",
            value: Phone
        },
        {
            name: "Password",
            value: ConvertPass
        },
        {
            name: "PresentAddress",
            value: PresentAddress
        },
        {
            name: "PermanentAddress",
            value: PermanentAddress
        }
    ];
    const data = await executeQuery(dbConfig3, query, params);
    if(data){
        return {message:"success"};
    }
    return {message:"Error while inserting"};
}


module.exports = tmsRegistrationServices;