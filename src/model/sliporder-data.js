const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const {response} = require('../util/response-format');
const logger = require('../util/logger');

const insertSOL = (dataSOL) =>{
    return new Promise((resolve) =>{
        try{
            const query =
            `INSERT INTO ihp_sol
            ([sliporder],
            [date], 
            [shift], 
            [reception], 
            [kamar], 
            [status], 
            [chtime], 
            [chusr], 
            [pos], 
            [date_trans], 
            [mobile_pos])
            VALUES
            ('${dataSOL.sol_code}'
            ,CONVERT(VARCHAR(24),GETDATE(),103) + ' '+ SUBSTRING(CONVERT(VARCHAR(24),GETDATE(),114),1,8)
            ,'${dataSOL.shift}'
            ,'${dataSOL.rcp}'
            ,'${dataSOL.room_code}'
            ,'1'
            ,CONVERT(VARCHAR(24),GETDATE(),103) + ' '+ SUBSTRING(CONVERT(VARCHAR(24),GETDATE(),114),1,8)
            '${dataSOL.chusr}'
            ,'localhost'
            ,${dataSOL.date_trans}
            ,'self service')`;

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Error Connect To Database \n ${err}`)
                    resolve(false)
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error insertSOL Query \n ${query} \n ${err}`)
                            resolve(false);
                        }else{
                            logger.info(`SUCCESS INSERT IHP_Sol ${dataSOL.rcp} ${dataSOL.sol_code}`);
                            resolve(true);
                        }
                    });
                }
            });
        }catch(errr){
            logger.error(`Error insertSOL Query\n${err}`);
            resolve(false);
        }
    });
}

const insertSOD = (dataSod) =>{
    return new Promise((resolve) =>{
        try{
            const query = `INSERT INTO IHP_Sod
            ([SlipOrder],
            [Inventory],
            [Nama],
            [Price],
            [Qty],
            [Total],
            [Status],
            [Location],
            [Printed],
            [Note],
            [CHusr],
            [Urut])
            VALUES
            ('${dataSod.sol_code}',
            '${dataSod.inventory}',
            '${dataSod.name}',
            '${parseFloat(dataSod.price)}',
            '${dataSod.quantity}',
            '${parseFloat(dataSod.price * dataSod.quantity)}',
            '1',
            '${dataSod.location}',
            '2',
            '${dataSod.note}',
            '${dataSod.chusr}',
            ${parseInt(dataSod.urut)})`;

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Error Connect To Database \n ${err}`)
                    resolve(false)
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error insertSOD Query \n ${query} \n ${err}`)
                            resolve(false);
                        }else{
                            logger.info(`SUCCESS INSERT IHP_Sod ${dataSod.sol_code}`);
                            resolve(true);
                        }
                    });
                }
            });
        }catch(err){
            logger.error(`insertSOD\n${err}`);
            resolve(false);
        }
    });
}

const insertSodPromo = (dataSodPromo) =>{
    return new Promise((resolve) =>{
        try{
            const query =`
            INSERT INTO IHP_Sod_Promo
            ([SlipOrder],
            [Inventory],
            [Promo_Food],
            [Harga_Promo])
            VALUES
            ('${dataSodPromo.sol_code}'
            '${dataSodPromo.inventory}'
            '${dataSodPromo.promo_name}'
            '${parseFloat((dataSodPromo.price * dataSodPromo.quantity))}'
            )`;

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Error Connect To Database \n ${err}`)
                    resolve(false)
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error insertSodPromo Query \n ${query} \n ${err}`)
                            resolve(false);
                        }else{
                            logger.info(`SUCCESS INSERT IHP_Sod_Promo ${dataSodPromo.sol_code} ${dataSodPromo.inventory}`);
                            resolve(true);
                        }
                    });
                }
            });
        }catch(err){
            logger.error(`insertSodPromo\n${err}`);
            resolve(false); 
        }
    })
}
module.exports = {
    insertSOL,
    insertSOD,
    insertSodPromo
}