
const sqlDB = require('mssql');
const sql = require('mssql')
const {get, closeAll}=require('./manager')

const {
	dbConfig,
	dbConfig2
} = require('./settings');

exports.executeSql = (sql, callback) => {
	let conn = new sqlDB.ConnectionPool(dbConfig);
	conn.connect()
		.then(function () {
			let req = new sqlDB.Request(conn);
			req.query(sql)
				.then(function (data) {
					callback(data);
				})
				.catch(function (err) {
					console.log(err);
					callback(null, err);
				})
		})
		.catch(function (err) {
			console.log(err);
			callback(null, err);
		})
}

exports.executeSqlB = async (query) => {
	let result;
	try {
		let pool = await get('first',dbConfig)
		result = await pool.request().query(query)
	} catch (err) {
		console.log(err);
		throw `DATABASE ${err.name}`;
	}
	return result
}

exports.executeSqlB2 = async (query) => {
	let result;
	try {
		//let pool = await sql.connect(dbConfig)
		let pool = await get('second',dbConfig2)
		result = await pool.request().query(query);
	} catch (err) {
		console.log(err);
		throw `DATABASE ${err.name}`;
	}finally{
		closeAll();
	}
	return result
}