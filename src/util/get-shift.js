const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const logger = require('../util/logger');

const getshiftTemp = () =>{
    return new Promise((resolve)=>{
        try{
            const query = `
            SELECT
            CASE  
                WHEN CONVERT(varchar, GETDATE(), 108) between [Worktime_Start] AND [Shifttime] THEN 1
                WHEN CONVERT(varchar(24), GETDATE(), 108) between [Shifttime] AND '23:59:59' THEN 2
                WHEN CONVERT(varchar(24), GETDATE(), 108) <= [Worktime_Finish] AND [Workdate_Finish] = '3' THEN 3
                ELSE 0
            END 
                AS shift
            FROM [IHP_Config]
            WHERE DATA = '1'
            `

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Error Connect To Database \n ${err}`)
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error getshiftTemp Query \n ${query} \n ${err}`)
                            resolve(false);
                        }else{
                            if(result.recordset.length>0){
                                resolve(result.recordset[0].shift);
                            }else{
                                logger.error('DATA Config 1 tidak lengkap');
                                resolve(false);
                            }
                        }
                    });
                }
            });
        }catch(err){
            logger.error('ERROR getshiftTemp '+err);
        }
    })
}

const getshift = () =>{
    return new Promise(async(resolve)=>{
        try{
            const shiftTemp = await getshiftTemp();
            let shift;
            if(shiftTemp == '3'){
                shift = '2'
            }else{
                shift = shiftTemp;
            }
            resolve(shift);
        }catch(err){
            logger.error('ERROR getshift '+err);
        }
    })
}

module.exports = {
    getshiftTemp,
    getshift
}