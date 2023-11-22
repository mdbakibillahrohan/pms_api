const dbConfig = {
	user: "softadmin",
	password: "w23eW@#E",
	server: "192.168.61.49",
	database: "ProductionManagementLive",
	port:1433,
	//database: "ERPUSERDB",
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

const dbConfig2 = {
	user: "sa",
	password: "w23eW@#E",
	server: "202.22.203.92",
	//database: "CoreERP",
	database: "ERPUSERDB",
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

const approvalSequence = [];

module.exports = {
	dbConfig,
	dbConfig2
};
