const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const {response} = require('../util/response-format');
const logger = require('../util/logger');

const getInitialTransCode = () =>{
    return new Promise((resolve) =>{
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
                                    logger.error(`Error connect to database`)
                                }else{
                                    new sql.Request().query(query, (err, result) =>{
                                        if(err){
                                            logger.error()
                                        }else{

                                        }
                                    });
                                }
                            });
        }catch(err){
            resolve(false)
        }
    })
}