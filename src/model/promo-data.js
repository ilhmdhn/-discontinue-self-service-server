const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const logger = require("../util/logger");
const {response} = require('../util/response-format');

const roomPromoData = () =>{
    return new Promise((resolve, reject) =>{
        try{
            const query = `SELECT [Promo_Room] as name, isnull([Diskon_Persen], 0) AS discount_percent, isnull([Diskon_Rp],0) as discount_idr FROM IHP_PromoRoom WHERE Time_Start <= CONVERT(varchar,getDate(), 108) AND Time_Finish >= CONVERT(varchar,getDate(), 108) AND Status = 1`

            sql.connect(sqlConfig, err=>{
                if(err){
                    reject('Cant connect to database', err);
                }
                new sql.Request().query(query, (err, result) =>{
                    if(err){
                        reject(`roomPromoData query error \n${query}\n${err}`)
                    }else{
                        if(result.recordset.length>0){
                            resolve(response(true,result.recordset));
                        }else{
                            resolve(response(false, null, "Data Kosong"))
                        }
                    }
                });
            })
        }catch(err){
            reject("Error roomPromoData\n"+err);
        }
    })
}

const fnbPromoData = () =>{
    return new Promise((resolve, reject) =>{
        try{
            const query = `SELECT [Promo_Food] AS name, isnull([Diskon_Persen], 0) AS discount_percent, isnull([Diskon_Rp],0) AS discount_idr FROM IHP_PromoFood WHERE Time_Start <= CONVERT(varchar,getDate(), 108) AND Time_Finish >= CONVERT(varchar,getDate(), 108) AND Status = 1`
            
            sql.connect(sqlConfig, err=>{
                if(err){
                    reject(`cant't connect to database \n${err}`);
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            reject(`fnbPromoData query error \n${query}\n${err}`);
                        }else{
                            if(result.recordset.length>0){
                                resolve(response(true, result.recordset));
                            }else{
                                resolve(response(false, null, "data kosong"))
                            }
                        }
                    });
                }
            })
        }catch(err){
            reject("Error fnbPromoData\n"+err);
        }
    })
}

const getPromoFoodData = (name) =>{
    return new Promise((resolve)=>{
        try{

            const query =   `SELECT [Promo_Food] as promo_name, 
                                [Time_Start] as time_start, 
                                [Time_Finish] as time_finish, 
                                [Diskon_Persen] as discount_percent, 
                                [Diskon_Rp] as discount_idr 
                            FROM IHP_PromoFood
                            WHERE [Status] = 1 AND [Promo_Food] = '${name}'`

            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`cant't connect to database \n${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`getPromoFoodData query\n${query}\n${err}`);
                            resolve(false);
                        }else{
                            if(result.recordset.length>0){
                                logger.info('SUCCESS getPromoFoodData');
                                resolve(result.recordset[0]);
                            }else{
                                logger.info('PROMO DATA FOOD KOSONG '+name);
                                resolve(false);
                            }
                        }
                    });
                }
            });
        }catch(err){
            resolve(false);
        }
    });
}

const getPromoRoomData = (name) =>{
    return new Promise((resolve)=>{
        try{
            const query =   `SELECT [Promo_Room] as promo_name, 
                                [Time_Start] as time_start, 
                                [Time_Finish] as time_finish, 
                                [Diskon_Persen] as discount_percent, 
                                [Diskon_Rp] as discount_idr 
                            FROM IHP_PromoRoom
                            WHERE [Status] = 1 AND [Promo_Room] = '${name}'`
            
            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`cant't connect to database \n${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`getPromoFoodData query\n${query}\n${err}`);
                            resolve(false);
                        }else{
                            if(result.recordset.length>0){
                                logger.info('SUCCESS getPromoFoodData');
                                resolve(result.recordset[0]);
                            }else{
                                logger.info(`PROMO DATA ROOM KOSONG ${name}`);
                                resolve(false);
                            }
                        }
                    });
                }
            });
        }catch(err){
            resolve(false);
            logger.error(`getPromoFoodData\n${err}`);
        }
    });
}

module.exports = {
    roomPromoData, 
    fnbPromoData,
    getPromoFoodData,
    getPromoRoomData
}