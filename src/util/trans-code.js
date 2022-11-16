const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const logger = require('../util/logger');
const moment = require('moment');
const {getshiftTemp} = require('./get-shift');

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
                                                reject(`Config 3 kosong`);
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
//untuk mengurangi hari
//var startdate = moment().subtract(1, "days").format("DD-MM-YYYY");

const generateReceptionCode =() =>{
return new Promise(async (resolve, reject) =>{
    try{
            const initial = await getInitialTransCode();
            let date;
            let shiftTemp;
            if(shiftTemp == '3'){
                date = moment().subtract(1, "days").format("YYMMDD");
            }else{
                date = moment().format('YYMMDD');
            }
            let rcp = initial.reception+'-'+date;
            const todayReception = await getTotalReceptionToday(rcp);
            rcp = initial.reception+'-'+date+(todayReception+1).toString().padStart(4, '0');
            resolve(rcp);
    }catch(err){
            reject(`Error generateReceptionCode\n${err}`)
    }});
}

const generateInvoiceCode = () =>{
    return new Promise(async(resolve, reject)=>{
        try{
            const initial = await getInitialTransCode();
            const shiftTemp = await getshiftTemp();
            let date;
            if(shiftTemp == '3'){
                date = moment().subtract(1, "days").format("YYMMDD");
            }else{
                date = moment().format('YYMMDD');
            }
            let ivc = initial.invoice+'-'+date;
            const todayInvoice = await getTotalInvoiceToday(ivc);
            ivc = initial.invoice+'-'+date+(todayInvoice+1).toString().padStart(4, '0');
            resolve(ivc);
        }catch(err){
            reject(`Error generateInvoiceCode\n${err}`);
        }
    })
}

const generateSlipOrderCode = () =>{
    return new Promise( async(resolve) =>{
        try{
            const initial = await getInitialTransCode();
            const shiftTemp = await getshiftTemp();
            let date;
            if(shiftTemp == '3'){
                date = moment().subtract(1, "days").format("YYMMDD");
            }else{
                date = moment().format('YYMMDD');
            }
            let sol = initial.slipOrder+'-'+date;
            const todaySlipOrder = await getTotalSolToday(sol);
            sol = initial.slipOrder+'-'+date+(todaySlipOrder+1).toString().padStart(4,'0');
            resolve(sol);
        }catch(err){
            logger.error(`generateSlipOrderCode ${err}`);
            resolve(false);
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

const getTotalInvoiceToday = (ivc)=>{
    return new Promise((resolve, reject)=>{
        try{
            const query = `SELECT COUNT(*) as count FROM IHP_Ivc WHERE Invoice LIKE '${ivc}%'`;
            sql.connect(sqlConfig, err=>{
                if(err){
                    reject(`can't connect to database\n{err}`)
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error getTotalInvoiceToday query\n${query}\n${err}`)
                        }else{
                            resolve(result.recordset[0].count);
                        }
                    });
                }
            });
        }catch(err){
            reject('getTotalInvoiceToday\n'+err);
        }
    })
}

const getTotalSolToday = (data) =>{
    return new Promise((resolve) =>{
        try{
            const query = `SELECT COUNT(*) as count FROM IHP_Sol WHERE [SlipOrder] LIKE '${data}%'`;
            sql.connect(sqlConfig, err=>{
                if(err){
                    reject(`can't connect to database\n{err}`)
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error getTotalSolToday query\n${query}\n${err}`)
                        }else{
                            resolve(result.recordset[0].count);
                        }
                    });
                }
            });
        }catch(err){
            logger.error(`getTotalSolToday ${err}`);
            resolve(false);
        }
    });
}

module.exports = {
    getInitialTransCode,
    generateReceptionCode,
    generateInvoiceCode,
    generateSlipOrderCode
}