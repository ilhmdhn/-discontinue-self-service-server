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

module.exports = {
    getIpAndUdpPortAddress
}