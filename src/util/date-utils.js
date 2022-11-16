const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const logger = require('../util/logger');
const moment = require('moment');

const todayMBL = () =>{
    return new Promise((resolve) =>{
        try{
            const query = `SELECT COUNT(*) as mbl FROM IHP_MBL WHERE DATEDIFF (d, CONVERT(varchar, getdate(), 111), CONVERT(varchar, Date_Libur, 111)) = 1`

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Error Connect to Database \n ${err}`)
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error get MBL Query \n ${query} \n ${err}`);
                            resolve(false)
                        }else{
                            if(result.recordset.length>0){
                                if(result.recordset[0].mbl == 1){
                                    resolve(true)
                                }else{
                                    resolve(false)
                                }
                            }else{
                                resolve(false);
                            }
                        }
                    });
                }
            })
        }catch(err){
            logger.error('Error todayMBL function\n' + err);
            resolve(false);
        }
    })
}

const todayHoliday = () =>{
    return new Promise((resolve) =>{
        try{
            const query = `SELECT COUNT(*) as mbl FROM IHP_MBL WHERE DATEDIFF (d, CONVERT(varchar, getdate(), 111), CONVERT(varchar, Date_Libur, 111)) = 0`

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Error Connect to Database \n ${err}`)
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error get holiday Query \n ${query} \n ${err}`);
                            resolve(false)
                        }else{
                            if(result.recordset.length>0){
                                if(result.recordset[0].mbl == 1){
                                    resolve(true)
                                }else{
                                    resolve(false)
                                }
                            }else{
                                resolve(false);
                            }
                        }
                    });
                }
            })
        }catch(err){
            logger.error('Error todayHoliday function\n' + err);
            resolve(false);
        }
    })
}

const todayNumber = () =>{
    return new Promise((resolve, reject) =>{
        try{

            let dateNumber;
            
            switch(moment().format('dddd')) {
                case 'Sunday':
                    dateNumber = 1;
                break;
                
                case 'Monday':
                    dateNumber = 2;
                break;
                
                case 'Tuesday':
                    dateNumber = 3;
                break;

                case 'Wednesday':
                    dateNumber = 4;
                break;
                
                case 'Thrusday':
                    dateNumber = 5;
                break;
                
                case 'Friday':
                    dateNumber = 6;
                break;
                
                case 'Saturday':
                    dateNumber = 7;
                break;
              }

              resolve(dateNumber)

        }catch(err){
            reject(`Error todayDateNumber \n ${err}`)
        }
    })
}

const todayDateNumber = async() =>{
    return new Promise((resolve) =>{
        try{

            const isMBL = todayMBL();
            const todayHoliday_ = todayHoliday();
            const todayNumber_ = todayNumber();

            if(isMBL){
                resolve(8)
            }else if(todayHoliday_){
                resolve(9)
            }else if(todayNumber_){
                resolve(todayNumber_)
            }else{
                resolve(1)
            }
        }catch(err){
            logger.error(`Error todayDateNumber \n ${err}`)
        }
    })
}

const transactionDate = (shift) =>{
    return new Promise((resolve)=>{
        try{
            let query;
            if (shift == '1') {
              query = "getdate()";
            } else if (shift == '2') {
              query = "getdate()";
            } else if (shift == '3') {
              query = "DATEADD(dd, -1, GETDATE())";
            }
            resolve(query);
        }catch(err){
            logger.error(`dateTrans \n${err}`)
        }
    })
}

module.exports = {
    todayMBL,
    todayHoliday,
    todayNumber,
    todayDateNumber,
    transactionDate
}