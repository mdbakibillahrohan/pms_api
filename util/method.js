function calcTime(offset) {
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let nd = new Date(utc + (3600000 * offset));
    return {
        hour: nd.getHours(),
        minute: nd.getMinutes(),
        second: nd.getSeconds(),
    };
}
module.exports=calcTime
