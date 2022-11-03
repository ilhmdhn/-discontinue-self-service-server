const sql = require('mssql');
const fs = require('fs');
const express = require('express');
const app = express();
const logger = require('../util/logger');

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

const connectionDbCheck = () =>{
  return new Promise((resolve, reject)=>{
    let connectionStatus = {
      "connected": false,
      "database_name": setup.db_name,
      "database_ip": setup.db_server_ip,
      "message": ""
  }
    try{
      sql.connect(sqlConfig, err=>{
        if(err){
          connectionStatus = {
            "connected": false,
            "database_name": setup.db_name,
            "database_ip": setup.db_server_ip,
            "message": `Database connection failed \n ${err}`
        }
          logger.error(`Error Connect To Database \n ${err}`)
          resolve(connectionStatus);
        }else{
          connectionStatus = {
            "connected": true,
            "database_name": setup.db_name,
            "database_ip": setup.db_server_ip,
            "message": "Success"
        }
        resolve(connectionStatus)
        }
      })
    }catch(err){
      logger.error(`Error Check Database Connection \n ${err}`)
      connectionStatus = {
        "connected": false,
        "database_name": setup.db_name,
        "database_ip": setup.db_server_ip,
        "message": err
    }
      resolve(connectionStatus)
    }
  });
}

module.exports = {
    sqlConfig,
    connectionDbCheck
}