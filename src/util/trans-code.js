const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const logger = require('../util/logger');
const moment = require('moment');

const getInitialTransCode = () =>{
    return new Promise((resolve, reject) =>{
        try{
            const query = `SELECT [RSV] as reservasi,
                            [RCP] as reception,
                            [SOL] as slipOrder,
                            [OCL] as orderCancel,
                            [KLR] as minimart,
                            [IVC] as invoice,
                            [MSK] as pembelian,
                            [SUM] as summary
                            FROM IHP_Config3 WHERE Data ='1'`
            
                            sql.connect(sqlConfig, err =>{
                                if(err){
                                    reject(`Error connect to database\n ${err}`);
                                }else{
                                    new sql.Request().query(query, (err, result) =>{
                                        if(err){
                                            logger.error(`Error query ${query}`)
                                        }else{
                                            if(result.recordset.length>0){
                                                resolve(result.recordset[0]);
                                            }else{
                                                reject(`Config 3 kosong`)
                                            }
                                        }
                                    });
                                }
                            });
        }catch(err){
            resolve(false)
        }
    })
}

const generateReceptionCode =() =>{

    return new Promise(async (resolve, reject) =>{
        try{
            const initial = await getInitialTransCode();
            const date = moment().format('YYMMDD')
            let rcp = initial.reception+'-'+date;
            const todayReception = await getTotalReceptionToday(rcp);
            rcp = initial.reception+'-'+date+(todayReception+1).toString().padStart(4, '0');

            console.log(rcp);
            resolve(rcp)
        }catch(err){
            reject(`Error generateReceptionCode\n${err}`)
        }
    });
}

const getTotalReceptionToday = (hari)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const query = `SELECT COUNT(*) as count FROM IHP_Rcp WHERE Reception LIKE '${hari}%'`
            sql.connect(sqlConfig, err =>{
                if(err){
                    reject(`cant connect to database\n${err}`)
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error query \n${query}\n${err}`)
                        }else{
                            resolve(result.recordset[0].count)
                        }
                    });
                }
            })
        }catch(err){
            reject('getTotalReceptionToday\n'+err);
        }
    })
}

generateReceptionCode()

module.exports = {
    getInitialTransCode,
    generateReceptionCode};