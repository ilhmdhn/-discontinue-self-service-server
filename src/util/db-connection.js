const sql = require('mssql');
const fs = require('fs');
const express = require('express')
const app = express();

const setup = JSON.parse(fs.readFileSync('setup.json'));

const sqlConfig = {
  user: setup.db_user,
  password: setup.db_password,
  database: setup.db_name,
  server: setup.db_server_ip,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

const dbConnection = async() =>{
    return new Promise((resolve) =>{
        try{
            const appPool = new sql.ConnectionPool(sqlConfig)
            appPool.connect().then(function(pool) {
                app.locals.db = pool;
                const connectionStatus = {
                    "Connected Status": pool._connected,
                    "Is Connecting?": pool._connecting,
                    "Database Name": pool.config.database,
                    "Database Server IP": pool.config.server,
                }
                appPool.close()
                resolve(connectionStatus)
            }).catch(function(err) {
                resolve('Error creating connection pool', err)
                console('Error creating connection pool '+ err)
              });  
        }catch(err){
            console.log(err.message)
        }
    })
}

module.exports = {
    dbConnection,
    sqlConfig
}