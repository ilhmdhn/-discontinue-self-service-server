const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const logger = require('../util/logger');

const getIpAndUdpPortAddress = (apps) =>{
    return new Promise((resolve)=>{
        try{
            const query =`
                    SELECT
                    [IP_Address] as ip_address,
                    [Server_Udp_Port] as udp_port_address
                    from [IHP_IPAddress]
                    WHERE
                    Aplikasi= '${apps}'`;

            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error getIpAndUdpPortAddress query\n${query}\n${err}`);
                        }else{
                            if(result.recordset.length>0){
                                logger.info(`SUCCESS Get IP and Udp Address ${apps}`);
                                resolve(result.recordset[0]);
                            }else{
                                logger.error('IP and Udp Address Not Found '+apps);
                                resolve(false)
                            }
                        }
                    });
                }
            });
        }catch(err){
            logger.error(`getIpAndUdpPortAddress ${err}`);
            resolve(false);
        }
    });
}

const getIpRoom = (room) =>{
    return new Promise((resolve)=>{
        try{
            const query = `
            SELECT 
            [Kamar] as room
            ,[IP_Address] as ip_address
            ,[Server_Socket_Port] as socket_port
            ,[Server_Udp_Port] as udp_port
            FROM [IHP_IPAddress_Room_No]
            WHERE [Kamar] = '${room}'
            `
            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error getIpRoom query\n${query}\n${err}`);
                        }else{
                            if(result.recordset.length>0){
                                logger.info(`SUCCESS IP ROOM Address ${room}`);
                                resolve(result.recordset[0]);
                            }else{
                                logger.error('IP ROOM Not Found '+room);
                                resolve(false)
                            }
                        }
                    });
                }
            });
        }catch(err){
            logger.error(`getIpRoom ${err}`);
            resolve(false)
        }
    })
}

module.exports = {
    getIpAndUdpPortAddress,
    getIpRoom
}