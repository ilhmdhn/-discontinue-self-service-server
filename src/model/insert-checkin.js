const sql = require("mssql");
const {sqlConfig} = require('../util/db-connection');
const logger = require('../util/logger');

const insertRcp = (rcpData) =>{
    return new Promise((resolve, reject) =>{
        try{
            const query = `
            INSERT INTO IHP_Rcp (
                [Reception]
                ,[DATE]
                ,[SHIFT]
                ,[Member]
                ,[Nama]
                ,[Kamar]
                ,[Checkin]
                ,[Jam_Sewa]
                ,[Menit_Sewa]
                ,[Checkout]
                ,[QM1]
                ,[QM2]
                ,[QM3]
                ,[QM4]
                ,[QF1]
                ,[QF2]
                ,[QF3]
                ,[QF4]
                ,[PAX]
                ,[Keterangan]
                ,[Uang_Muka]
                ,[Id_Payment]
                ,[Uang_Voucher]
                ,[Chtime]
                ,[Chusr]
                ,[MBL]
                ,[Status]
                ,[Posted]
                ,[Surcharge]
                ,[Flag]
                ,[Export]
                ,[Reservation]
                ,[Invoice]
                ,[Summary]
                ,[KMS]
                ,[Date_Trans]
                ,[Reception_Lama]
                ,[status_promo]
                ,[FlagStep]
                ,[Complete]
                ,[Printed_Slip_Checkin]
                ,[Member_Rev]
                )VALUES(
                '${rcpData.reception}',
                CONVERT(VARCHAR(24), GETDATE(), 103) + ' ' + SUBSTRING(CONVERT(VARCHAR(24), GETDATE(), 114), 1, 8),
                '${rcpData.shift}',
                '${rcpData.member}',
                '${rcpData.name}',
                '${rcpData.room}',
                GETDATE(),
                ${rcpData.duration},
                0,
                DATEADD(hour, ${rcpData.duration}, GETDATE()),
                ${rcpData.QM1},
                ${rcpData.QM2},
                ${rcpData.QM3},
                ${rcpData.QM4},
                ${rcpData.QF1},
                ${rcpData.QF2},
                ${rcpData.QF3},
                ${rcpData.QF4},
                ${rcpData.PAX},
                '${rcpData.keterangan}',
                ${rcpData.uang_muka},
                ${rcpData.id_payment},
                ${rcpData.uang_voucher},
                CONVERT(VARCHAR(24), GETDATE(), 103) + ' ' + SUBSTRING(CONVERT(VARCHAR(24), GETDATE(), 114), 1, 8),
                '${rcpData.chusr}',
                '${rcpData.MBL}',
                '1',
                '',
                'N',
                '',
                '',
                '',
                '',
                '',
                '',
                GETDATE(),
                '',
                ${rcpData.status_promo},
                '',
                '0',
                '-1',
                '${rcpData.member}'
                )
            `;

        sql.connect(sqlConfig, err=>{
            if(err){
                logger.error(`Can't connect to database ${err}`);
                resolve(false)
            }else{
                new sql.Request().query(query, (err, result)=>{
                    if(err){
                        logger.error(`insert ihp rcp query \n${query}\n${err}`);
                        resolve(false)
                    }else{
                        resolve(true)
                    }
                })
            }
        })
        }catch(err){
            logger.error(`Error insertRcp \n${err}`);
            resolve(false);
        }
    });
}

const insertIvc = (ivcData) =>{
    return new Promise((resolve, reject) =>{
        try{
            const query =
                `set dateformat dmy
                INSERT INTO [IHP_Ivc]
                ([Invoice],
                [DATE],
                [Shift],
                [Reception],
                [Member],
                [Nama],
                [Kamar],
                [Sewa_Kamar],
                [Total_Extend],
                [Overpax],
                [Discount_Kamar],
                [Surcharge_Kamar],
                [Service_Kamar],
                [Tax_Kamar],
                [Total_Kamar],
                [Charge_Penjualan],
                [Total_Cancelation],
                [Discount_Penjualan],
                [Service_Penjualan],
                [Tax_Penjualan],
                [Total_Penjualan],
                [Charge_Lain],
                [Uang_Muka],
                [Uang_Voucher],
                [Total_All],
                [Transfer],
                [Status],
                [Chtime],
                [Chusr],
                [Printed],
                [Flag],
                [Posted],
                [Date_Trans],
                [Jenis_Kamar])
                VALUES(
                '${ivcData.invoice}'
                ,CONVERT(VARCHAR(24),GETDATE(),103) + ' '+ SUBSTRING(CONVERT(VARCHAR(24),GETDATE(),114),1,8)
                ,'${ivcData.shift}'
                ,'${ivcData.rcp}'
                ,'${ivcData.member_code}'
                ,'${ivcData.member_name}'
                ,'${ivcData.room_code}'
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,0
                ,'${ivcData.uang_muka}'
                ,0
                ,0
                ,'${ivcData.invoice_transfer}'
                ,'1'
                ,CONVERT(VARCHAR(24),GETDATE(),103) + ' '+ SUBSTRING(CONVERT(VARCHAR(24),GETDATE(),114),1,8)
                ,'${ivcData.chusr}'
                ,'0'
                ,''
                ,''
                ,getdate()
                ,'${ivcData.room_type}'
                )
                `
            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Can't connect to database ${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error insertIvc query \n${query}\n${err}`)
                            resolve(false);
                        }else{
                            resolve(true)
                        }
                    })
                }
            })
        }catch(err){
            logger.error(`Error insertIvc\n${err}`)
        }
    })
}

const updateIhpRcpAddInvoice = (rcp, invoice)=>{
    return new Promise((resolve)=>{
        try{
            const query =  `
            UPDATE IHP_Rcp SET [Invoice] = '${invoice}' WHERE [Reception] = '${rcp}'
            `
            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`Error can't connect to database\n${err}`)
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error updateIhpRcpAddInvoice query\n${query}\n${err}`)
                            resolve(false);
                        }else{
                            resolve(true);
                        }
                    })
                }
            })
        }catch(err){
            logger.error(`Error updateIhpRcpAddInvoice ${err}`);
            resolve(false);
        }
    })
}

const insertRoomCheckin = (room, rcp) =>{
    return new Promise((resolve, reject)=>{
        try{
            const query = `INSERT INTO IHP_RoomCheckin([Kamar], [Reception]) VALUES('${room}', '${rcp}')`

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`can't connect to database\n${err}`);
                    resolve(false)
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error insertRoomCheckinQuery\n${query}\n${err}`)
                            resolve(false)
                        }else{
                            resolve(true);
                        }
                    });
                }
            })
        }catch(err){
            logger.error(`Error insertRoomCheckin\n${err}`);
            resolve(false)
        }
    });
}

const updateIhpRoom = (room, rcp, member_name, pax, duration) =>{
    return new Promise((resolve, reject)=>{
        try{

            const query = `SET DATEFORMAT DMY
            UPDATE IHP_Room SET
                [Reception] = '${rcp}',
                [Nama_Tamu] = '${member_name}',
                [Jumlah_Tamu] = '${pax}',
                [Jam_Checkin] = GETDATE(),
                [Jam_Masuk] = GETDATE(),
                [Jam_CHeckout] = DATEADD(hour, ${duration}, GETDATE()),
                [Status_Checkin] = 1
                WHERE [Kamar] = '${room}'
                `;
            
            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database\n${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error updateIhpRoom query \n${query}\n${err}`);
                            resolve(false);
                        }else{
                            resolve(true);
                        }
                    })
                }
            });
        }catch(err){
            logger.error(`Error updateIhpRoom\n${err}`);
            resolve(false);
        }
    });
}

module.exports = { 
    insertRcp,
    insertIvc,
    insertRoomCheckin,
    updateIhpRoom,
    updateIhpRcpAddInvoice
}