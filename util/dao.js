const mssql = require("mssql");

/**
 * Take the Database configuration and query and parameter and return data
 * @param dbConfig
 * @param query
 * @param parameter
 * @returns
 */

const getData = async (dbConfig, query, parameter) => {
  const pool = new mssql.ConnectionPool(dbConfig);
  try {
    await pool.connect();
    const request = pool.request();
    parameter.forEach((element) => {
      request.input(element.name, element.value);
    });
    const result = await request.query(query);
    if (result !== null) {
      if (result.rowsAffected[0] > 0) {
        return result.recordset;
      }
    }
  } catch (error) {
    console.dir(error);
  } finally {
    if (pool.connected()) {
      pool.close();
    }
  }
};

const insertData = async (dbConfig, query, parameter) => {
  const pool = new mssql.ConnectionPool(dbConfig);
  try {
    await pool.connect();
    const request = pool.request();
    parameter.forEach((element) => {
      request.input(element.name, element.value);
    });
    const result = request.query(query);
    if (result !== null) {
      if ((await result).rowsAffected[0] > 0) {
        return (await result).recordset;
      }
    }
  } catch (error) {
    console.dir(error);
  } finally {
    if (pool.connected()) {
      pool.close();
    }
  }
};

const executeStoreProcedure = async (dbConfig, procedureName, parameter) => {
  const pool = new mssql.ConnectionPool(dbConfig);
  try {
    await pool.connect();
    const request = pool.request();
    parameter.forEach((element) => {
      request.input(element.name, element.value);
    });
    const result = request.execute(procedureName);
    if (result !== null) {
      if ((await result).rowsAffected[0] > 0) {
        return (await result).recordset;
      }
    }
  } catch (error) {
    console.dir(error);
  } finally {
    if (pool.connected()) {
      pool.close();
    }
  }
};

module.exports = { getData, insertData, executeStoreProcedure };
