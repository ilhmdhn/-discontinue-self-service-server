const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const {response} = require('../util/response-format');
const logger = require('../util/logger');

const categoryRoomData = () =>{

    return new Promise((resolve)=>{
        try{

            const query = "SELECT DISTINCT Jenis_Kamar as category_room FROM Ihp_Room";

            sql.connect(sqlConfig, err => {
                if(err){
                    logger.error(`Error Connect To Database \n ${err} \n ${err.message}`)
                    reject(response(false, null, err.message))
                }else{
                    new sql.Request().query(query, (err, result) => {
                        if(err){
                            logger.error(`Error categoryRoomData Query \n ${query} \n ${err} \n ${err.message}`)
                            reject(response(false, null, err.message))
                        }else{
                            if(result.recordset.length>0){
                                resolve(response(true, result.recordset))
                            }else{
                                resolve(response(false, null, "Data Kosong"))
                            }
                        }
                    })
                }
            });
        }catch(err){
            logger.error(`Error categoryRoomData \n ${err} \n ${err.message}`)
            reject(response(false, null, err.message))
        }
    })

}

const roomReadyData = (category) =>{
    return new Promise((resolve, reject) =>{
        try{
            const query = `SELECT * FROM Ihp_Room WHERE Reception IS NULL AND Nama_Tamu IS NULL AND Jumlah_Tamu IS NULL and Jenis_Kamar = '${category}'`

            sql.connect(sqlConfig, err =>{
                if(err){
                    reject(response(false, null, err.message))
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(response(false, null, err.message))
                        }else{
                            if(result.recordset.length>0){
                                resolve(response(true, result.recordset))
                            }else{
                                resolve(response(false, null, "Data Kosong"))
                            }
                        }
                    })
                }
            })
        }catch(err){
            resolve(response(false, null, err.message))
        }
    })
}

module.exports = {categoryRoomData, roomReadyData}