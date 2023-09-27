const dbConfig = {
	user: "softadmin",
	password: "w23eW@#E",
	server: "192.168.0.13",
	database: "ProductionManagementLive",
	port:4368,
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


module.exports = {
	dbConfig,
	dbConfig2
};
