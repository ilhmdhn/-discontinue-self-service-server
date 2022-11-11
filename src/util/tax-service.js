const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const logger = require('../util/logger');

const taxService = () =>{
    return new Promise((resolve)=>{
        try{
            const query = `SELECT 
            isnull([Service_Persen_Room],0) as room_percent_service,
            isnull([Service_Persen_Food],0) as food_percent_service,
            isnull([Tax_Persen_Room],0) as room_tax,
            isnull([Tax_Persen_Food],0) as food_tax

            FROM IHP_Config2 WHERE data = '1'
            `

            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database\n ${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`taxService query\n${query}\n${err}`);
                            resolve(false);
                        }else{
                            if(result.recordset.length>0){
                                logger.info('SUCCESS GET taxService');
                                resolve(result.recordset[0]);
                            }else{
                                resolve(false);
                            }
                        }
                    })
                }
            })
        }catch(err){
            logger.error(`taxService\n${err}`);
        }
    });
}

module.exports = taxService;