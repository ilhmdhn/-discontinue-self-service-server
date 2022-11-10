const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const logger = require('../util/logger');

const getCountRoomRate = (rcp) =>{
    return new Promise((resolve)=>{
        try{
            const query =  `SELECT SUM(Tarif_Kamar_Yang_Digunakan) as room_rate, SUM(Tarif_Overpax_Yang_Digunakan) as room_overpax_rate
                            FROM IHP_Detail_Sewa_Kamar WHERE [Reception] = '${rcp}'`
                sql.connect(sqlConfig, err=>{
                    if(err){
                        logger.error(`can't connect to database${err}`);
                        resolve(false);
                    }else{
                        new sql.Request().query(query, (err, result)=>{
                            if(err){
                                logger.error(`getCountRoomRate query \n${query}\n${err}`);
                                resolve(false);
                            }else{
                                if(result.recordset.length>0){
                                    logger.info('SUCCESS getCountRoomRate');
                                    resolve(result.recordset[0]);
                                }else{
                                    logger.error(`getCountRoomRate data empty`);
                                    resolve(false);
                                }
                            }
                        });
                    }
                });
        }catch(err){
            logger.error(`getCountRoomRate\n${err}`);
            resolve(false);
        }
    });
}

const getRoomPromo = (rcp) =>{
    return new Promise((resolve)=>{
        try{
            const query =  `SELECT 
                        isnull([Diskon_Persen],0) as percent_discount,
                        isnull([Diskon_Rp],0) as idr_discount FROM IHP_Promo_Rcp WHERE [Reception] = '${rcp}' AND Status_Promo = 1`

            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database${err}`);
                }else{
                    sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`getRoomPromo query\n${query}\n${err}`);
                        }else{
                            if(result.recordset.length>0){
                                resolve(result.recordset[0]);
                                logger.info('SUCCESS getRoomPromo');
                            }else{
                                resolve(false);
                            }
                        }
                    });
                }
            });
        }catch(err){
            logger.error(`getRoomPromo\n${err}`);
            resolve(false);
        }
    })
}

const ihpInvoiceUpdateData = (ivcData) =>{
    return new Promise((resolve)=>{
        try{
            const query = `
            UPDATE IHP_Ivc SET
                ,[Sewa_Kamar] = ${ivcData.Sewa_Kamar}
                ,[Total_Extend] = ${ivcData.Total_Extend}
                ,[Overpax] = ${ivcData.Overpax}
                ,[Discount_Kamar] = ${ivcData.Discount_Kamar}
                ,[Surcharge_Kamar] = ${ivcData.Surcharge_Kamar}
                ,[Service_Kamar] = ${ivcData.Service_Kamar}
                ,[Tax_Kamar] = ${ivcData.Tax_Kamar}
                ,[Total_Kamar] = ${ivcData.Total_Kamar}
                ,[Charge_Penjualan] = ${ivcData.Charge_Penjualan}
                ,[Total_Cancelation] = ${ivcData.Total_Cancelation}
                ,[Discount_Penjualan] = ${ivcData.Discount_Penjualan}
                ,[Service_Penjualan] = ${ivcData.Service_Penjualan}
                ,[Tax_Penjualan] = ${ivcData.Tax_Penjualan}
                ,[Total_Penjualan] = ${ivcData.Total_Penjualan}
                ,[Charge_Lain] = ${ivcData.Charge_Lain}
                ,[Uang_Muka] = ${ivcData.Uang_Muka}
                ,[Uang_Voucher] = ${ivcData.Uang_Voucher}
                ,[Total_All] = ${ivcData.Total_All}
                ,[Total_Extend_Sebelum_Diskon] = ${ivcData.Total_Extend_Sebelum_Diskon}
                ,[Diskon_Sewa_Kamar] = ${ivcData.Diskon_Sewa_Kamar}
                ,[Diskon_Extend_Kamar] = ${ivcData.Diskon_Extend_Kamar}
                ,[Sewa_Kamar_Sebelum_Diskon] = ${ivcData.Sewa_Kamar_Sebelum_Diskon}
            WHERE [Reception] = '${ivcData.rcp}'
            `

            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error ihpInvoiceUpdateData query\n${query}\n${err}`);
                        }else{
                            logger.info('SUCCESS ihpInvoiceUpdateData');
                            resolve(true)
                        }
                    });
                }
            })
        }catch(err){
            logger.error(`ihpInvoiceUpdateData\n${err}`)
        }
    });
}

const getDownPayment = (rcp) =>{
    return new Promise((resolve)=>{
        try{
            const query = `
            SELECT
            isnull([Uang_Muka],0) as down_payment,
            isnull([Uang_Voucher],0) as voucher
            FROM IHP_Rcp WHERE [Reception] = '${rcp}'
            `
            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`getDownPayment query \n${query}\n${err}`);
                            resolve(false);
                        }else{
                            if(result.recordset.length>0){
                                logger.info('SUCCESS getDownPayment');
                                resolve(result.recordset[0]);
                            }else{
                                logger.error(`getDownPayment data empty`);
                                resolve(false);
                            }
                        }
                    });
                }
            });
        }catch(err){
            logger.error(`getRoomPromo\n${err}`);
            resolve(false);
        }
    });
}

module.exports = {
    getCountRoomRate,
    getRoomPromo,
    ihpInvoiceUpdateData,
    getDownPayment
}