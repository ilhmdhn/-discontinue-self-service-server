const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const {response} = require('../util/response-format');
const logger = require('../util/logger');

const categoryFnBData = () =>{
    return new Promise((resolve, reject) =>{
        try{
            const query = `SELECT * FROM IHP_Inventory_Category`

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Error Connect To Database \n ${err}`)
                    reject(response(false, null, err))
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error categoryFnBData Query \n ${query} \n ${err}`)
                            reject(response(false, null, err));
                        }else{
                            if(result.recordset.length>0){
                                resolve(response(true, result.recordset));
                            }else{
                                resolve(response(false, null, "Data Kosong"))
                            }
                        }
                    });
                }
            });
        }catch(err){
            logger.error(`Error categoryFnBData Query \n ${query} \n ${err}`)
            reject(response(false, null, err));
        }
    })
}

const fnbData = (category, search) =>{
    return new Promise((resolve, reject) =>{
        try{

            if(search != ''){
                search = `AND Nama LIKE '${search}%'`
            }
            const query = `
            SELECT [Inventory], [InventoryID_Global], [Nama], [Price], isnull([image_url], 'default') as image
            FROM IHP_Inventory WHERE [Status] = 1 AND [GROUP] = ${category} ${search}
                `
                console.log(query)
            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error('Cant connect to database\n'+err)
                    reject(err)
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error fnbData Query \n ${query}\n${err}`)
                            reject(err)
                        }else{
                            if(result.recordset.length>0){
                                resolve(response(true, result.recordset))
                            }else{
                                resolve(response(false, null, 'Data Kosong'))
                            }
                        }
                    })
                }
            })
        }catch(err){
            logger.error("Error fnbData\n"+err)
            reject(err)
        }
    })
}

module.exports = {
    categoryFnBData,
    fnbData
}