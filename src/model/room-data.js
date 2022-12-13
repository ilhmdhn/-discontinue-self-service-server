const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const {response} = require('../util/response-format');
const logger = require('../util/logger');
const e = require("express");


const categoryRoomData = () =>{

    return new Promise((resolve, reject)=>{
        try{

            const query = "SELECT * FROM IHP_RoomCategory";

            sql.connect(sqlConfig, err => {
                if(err){
                    logger.error(`Error Connect To Database \n ${err}`)
                    reject(err)
                }else{
                    new sql.Request().query(query, (err, result) => {
                        if(err){
                            logger.error(`Error categoryRoomData Query \n ${query} \n ${err}`)
                            reject(err)
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
            logger.error(`Error categoryRoomData \n ${err}`)
            reject(err)
        }
    })

}

const roomReadyData = (category, date) =>{
    return new Promise((resolve, reject) =>{
        try{
            const query = `
            SELECT 
                isnull(room.[Kamar_Alias], room.[Kamar]) as room_name, 
                room.[Kamar] as room_code, 
                room.[Jenis_Kamar] as type_room, 
                room.[Kapasitas] as capacity,
                room.[room_image] as room_image,
			    isnull(price.Tarif,0) as price,
            CASE
            WHEN 
                (room.Reception IS NULL OR room.Reception = 'NULL')
            AND
                (room.Nama_Tamu IS NULL OR room.Nama_Tamu = 'NULL')
            AND
                room.Status_Checkin = 0
            AND
                room.Keterangan_Connect = 2
            THEN 1
            ELSE 0
            END as room_ready
            FROM 
                IHP_Room room
            LEFT JOIN 
                IHP_Jenis_Kamar price
			ON
				price.Nama_Kamar = room.Jenis_Kamar
		    AND 
                CONVERT(VARCHAR, CAST(price.Time_Start AS datetime), 108)  <= CONVERT(VARCHAR, getDate(), 108)
			AND 
                CONVERT(VARCHAR, CAST(price.Time_Finish AS datetime), 108) >= CONVERT(VARCHAR, getDate(), 108)
		    AND 
                price.Hari = ${date}
			WHERE 
                room.Jenis_Kamar = '${category}'
        `

            sql.connect(sqlConfig, err =>{
                if(err){
                    reject(`Error cant connect to database \n ${err}`)
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error roomReadyData Query \n ${query} \n${err}`);
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
            reject(response(false, null, err))
        }
    })
}

const roomDetailData = (code, date) =>{
    return new Promise((resolve, reject) =>{
        try{
            const query =`
                SELECT 
                    isnull(room.[Kamar_Alias], room.[Kamar]) as room_name, 
                    room.[Kamar] as room_code, 
                    room.[Jenis_Kamar] as type_room, 
                    room.[Kapasitas] as capacity,
                    room.[room_image] as room_image,
                    isnull(price.Tarif,0) as price,
                CASE
                WHEN 
                    (room.Reception IS NULL OR room.Reception = 'NULL')
                AND
                    (room.Nama_Tamu IS NULL OR room.Nama_Tamu = 'NULL')
                AND
                    room.Status_Checkin = 0
                AND
                    room.Keterangan_Connect = 2
                THEN 1
                ELSE 0
                END as room_ready
                FROM 
                    IHP_Room room
                LEFT JOIN 
                    IHP_Jenis_Kamar price
                ON
                    price.Nama_Kamar = room.Jenis_Kamar
                AND 
                    CONVERT(VARCHAR, CAST(price.Time_Start AS datetime), 108)  <= CONVERT(VARCHAR, getDate(), 108)
                AND 
                    CONVERT(VARCHAR, CAST(price.Time_Finish AS datetime), 108) >= CONVERT(VARCHAR, getDate(), 108)
                AND 
                    price.Hari = ${date}
                WHERE 
                    room.Kamar = '${code}'
            `

            sql.connect(sqlConfig, err =>{
                if(err){
                    reject(`Error cant connect to database \n ${err}`);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error roomDetailData Query \n ${query} \n${err}`);
                        }else{
                            if(result.recordset.length>0){
                                resolve(result.recordset[0]);
                            }else{
                                reject("Data Kosong");
                            }
                        }
                    });
                }
            })
        }catch(err){
            reject(`roomDetailData ${err}`);
        }
    })
}

const getRoomGalleryData = (roomCode) =>{
    return new Promise((resolve, reject)=>{
        try{
            const query =  `
                SELECT image_url FROM [dbo].[IHP_Room_Gallery] WHERE [code_room] = '${roomCode}'
            `

            sql.connect(sqlConfig, err=>{
                if(err){
                    reject(`Error cant connect to database \n ${err}`);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            reject(`Error roomDetailData Query \n ${query} \n${err}`);
                        }else{
                            if(result.recordset.length>0){
                                resolve(result.recordset)
                            }else{
                                resolve([]);
                            }
                        }
                    });
                }
            })
        }catch(err){
            resolve([]);
            logger.error('getRoomGallery\n'+ err);
        }
    });
}

module.exports = {
    categoryRoomData, 
    roomReadyData,
    roomDetailData,
    getRoomGalleryData
}