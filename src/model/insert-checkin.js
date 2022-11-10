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
                        logger.info('SUCCESS INSERT IHP_Rcp');
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
                            logger.info('SUCCESS INSERT IHP_Ivc');
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
                            logger.info('SUCCESS UPDATE IHP_Rcp set invoice');
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
                            logger.info('SUCCESS INSERT IHP_RoomCheckin');
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
                            logger.info('SUCCESS UPDATE IHP_Room as Room Checkin');
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

const getCheckinAndCheckoutTime = (rcp) =>{
    return new Promise((resolve, reject) =>{
        try{
            const query =`
            
            SET dateformat dmy SELECT
            [IHP_Rcp].[Reception] AS reception,
            CONVERT ( VARCHAR ( 24 ), [IHP_Rcp].[Checkin], 103 ) + ' ' + SUBSTRING ( CONVERT ( VARCHAR ( 24 ), [IHP_Rcp].[Checkin], 114 ), 1, 8 ) AS checkin,
            CONVERT ( VARCHAR ( 24 ), [IHP_Rcp].[Checkout], 103 ) + ' ' + SUBSTRING ( CONVERT ( VARCHAR ( 24 ), [IHP_Rcp].[Checkout], 114 ), 1, 8 ) AS checkout,
            CONVERT (
                VARCHAR ( 24 ),
                DATEADD(
                    MINUTE,
                    (
                        isnull( SUM ( [IHP_Ext].[Menit_Extend] ), 0 ) + ( isnull( SUM ( [IHP_Ext].[Jam_Extend] ), 0 ) * 60 ) + ( [IHP_Rcp].[Jam_Sewa] * 60 ) + [IHP_Rcp].[Menit_Sewa] 
                    ),
                    [IHP_Rcp].[Checkin] 
                ),
                103 
                ) + ' ' + SUBSTRING (
                CONVERT (
                    VARCHAR ( 24 ),
                    DATEADD(
                        MINUTE,
                        (
                            isnull( SUM ( [IHP_Ext].[Menit_Extend] ), 0 ) + ( isnull( SUM ( [IHP_Ext].[Jam_Extend] ), 0 ) * 60 ) + ( [IHP_Rcp].[Jam_Sewa] * 60 ) + [IHP_Rcp].[Menit_Sewa] 
                        ),
                        [IHP_Rcp].[Checkin] 
                    ),
                    114 
                ),
                1,
                8 
            ) AS checkout_plus_extends 
            FROM
                [IHP_Rcp]
                LEFT JOIN [IHP_Ext] ON [IHP_Rcp].[Reception] = [IHP_Ext].[Reception]
                LEFT JOIN [IHP_Room] ON [IHP_Rcp].[Reception] = [IHP_Room].[Reception] 
            WHERE
                [IHP_Rcp].[Reception] = '${rcp}' 
            GROUP BY
                [IHP_Rcp].[Reception],
                [IHP_Rcp].[Checkin],
                [IHP_Rcp].[Jam_Sewa],
                [IHP_Rcp].[Menit_Sewa],
                [IHP_Rcp].[Checkout],
                [IHP_Room].[Jam_Checkin],
                [IHP_Room].[Jam_Checkout],
                [Jenis_Kamar] 
            `

            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database\n${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error getCheckinAndCheckoutTime query\n${query}\n${err}`);
                            resolve(false);
                        }else{
                            if(result.recordset.length>0){
                                logger.info('SUCCESS GET getCheckinAndCheckoutTime');
                                resolve(result.recordset)
                            }else{
                                logger.info('FAILED GET getCheckinAndCheckoutTime data empty');
                                resolve(false)
                            }
                        }
                    });
                }
            })
        }catch(err){
            logger.error(`Error getCheckinAndCheckoutTime\n${err}`);
            resolve(false);
        }
    })
}

const getRateRoomHourly = (room_type, day_number, checkin, checkout)=>{
    return new Promise((resolve)=>{
        try{
            const query = `
            SET DATEFORMAT DMY EXEC Jam_Kena_Sewa_ '${room_type}',
            '${day_number}',
            '${checkin}',
            '${checkout}'
            `
        
            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database\n${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error getRateRoomHourly query\n${query}\n${err}`)
                        }else{
                            if(result.recordset.length>0){
                                logger.info('SUCCESS GET getRateRoomHourly');
                                resolve(result.recordset)
                            }else{
                                logger.error(`FAILED GET getRateRoomHourly data empty`);
                                resolve(false);
                            }
                        }
                    });
                }
            })
        }catch(err){
            logger.error(`Error getRateRoomHourly\n${err}`);
            resolve(false);
        }
    });
}

const insertRcpDetailsRoom = (rcp, room_type, dayNumber, overpax, room_rate, date_start, date_finish)=>{
    return new Promise((resolve, reject)=>{
        try{
            const query = `set dateformat dmy 
                INSERT INTO [dbo].[IHP_Rcp_DetailsRoom]
                ([Reception]
                ,[Nama_Kamar]
                ,[Hari]
                ,[Overpax]
                ,[Tarif]
                ,[Time_Start]
                ,[Time_Finish]
                ,[Date_Time_Start]
                ,[Date_Time_Finish])
                VALUES
                (
                    '${rcp}',
                    '${room_type}',
                    '${dayNumber}',
                    '${overpax}',
                    '${room_rate}',
                    '${date_start}',
                    '${date_finish}',
                    '${date_start}',
                    '${date_finish}'
                )`;
            sql.connect(sqlConfig, err=>{
                if(err){
                    logger.error(`can't connect to database${err}`);
                    resolve(false)
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error insertRcpDetailsRoom query\n${query}\n${err}`);
                            resolve(false);
                        }else{
                            logger.info('SUCCESS INSERT insertRcpDetailsRoom')
                            resolve(true)
                        }
                    });
                }
            })
        }catch(err){
            logger.error(`Error insertRcpDetailsRoom\n${err}`)
        }
    })
}

const countRoomRate = (rcp) =>{
    return new Promise((resolve, reject)=>{
        try{
            const query = 
                        `set
            dateformat dmy 
            delete
            from
                [IHP_Detail_Sewa_Kamar] 
            where
                Reception = '${rcp}' 
                insert into
                    [IHP_Detail_Sewa_Kamar] 
                    select
                        [IHP_Rcp].[Reception] as reception,
                        [IHP_Rcp_DetailsRoom].[Nama_Kamar] as Kamar,
                        [IHP_Rcp_DetailsRoom].[Hari] as Hari,
                        [IHP_Rcp_DetailsRoom].[Overpax] as Overpax,
                        [IHP_Rcp_DetailsRoom].[Tarif] as Tarif,
                        [IHP_Rcp_DetailsRoom].[Date_Time_Start] as Date_Time_Start,
                        [IHP_Rcp_DetailsRoom].[Date_Time_Finish] as Date_Time_Finish,
                        case
                        when
                            [IHP_Rcp_DetailsRoom].[Time_Start] between [IHP_Rcp].[Checkin] and [IHP_Rcp].[Checkout] 
                            and [IHP_Rcp_DetailsRoom].[Time_Finish] between [IHP_Rcp].[Checkin] and [IHP_Rcp].[Checkout] 
                        then
                            60 
                        when
                            [IHP_Rcp].[Checkin] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                            and [IHP_Rcp].[Checkout] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                        then
                            DATEDIFF(mi, [IHP_Rcp].[Checkin] , [IHP_Rcp].[Checkout] ) 
                        when
                            [IHP_Rcp].[Checkin] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                        then
                            DATEDIFF(mi, [IHP_Rcp].[Checkin] , [IHP_Rcp_DetailsRoom].[Time_Finish] ) 
                        when
                            [IHP_Rcp].[Checkout] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                        then
                            DATEDIFF(mi, [IHP_Rcp_DetailsRoom].[Time_Start], [IHP_Rcp].[Checkout]) 
                        else
                            0 
                        end
                        as Menit_Yang_Digunakan, 
                        case
                        when
                            [IHP_Rcp_DetailsRoom].[Time_Start] between [IHP_Rcp].[Checkin] and [IHP_Rcp].[Checkout] 
                            and [IHP_Rcp_DetailsRoom].[Time_Finish] between [IHP_Rcp].[Checkin] and [IHP_Rcp].[Checkout] 
                        then
                            [IHP_Rcp_DetailsRoom].[Tarif] 
                        when
                            [IHP_Rcp].[Checkin] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                            and [IHP_Rcp].[Checkout] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                        then
            ([IHP_Rcp_DetailsRoom].[Tarif] / 60)*DATEDIFF(mi, [IHP_Rcp].[Checkin] , [IHP_Rcp].[Checkout] ) 
                        when
                            [IHP_Rcp].[Checkin] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                        then
            ([IHP_Rcp_DetailsRoom].[Tarif] / 60)* DATEDIFF(mi, [IHP_Rcp].[Checkin] , [IHP_Rcp_DetailsRoom].[Time_Finish] ) 
                        when
                            [IHP_Rcp].[Checkout] >= [IHP_Rcp_DetailsRoom].[Time_Start] 
                            and [IHP_Rcp].[Checkout] <= [IHP_Rcp_DetailsRoom].[Time_Finish] 
                        then
            ([IHP_Rcp_DetailsRoom].[Tarif] / 60)* DATEDIFF(mi, [IHP_Rcp_DetailsRoom].[Time_Start], [IHP_Rcp].[Checkout]) 
                        else
                            0 
                        end
                        as Tarif_Kamar_Yang_Digunakan, 
                        case
                        when
                            [IHP_Rcp_DetailsRoom].[Time_Start] between [IHP_Rcp].[Checkin] and [IHP_Rcp].[Checkout] 
                            and [IHP_Rcp_DetailsRoom].[Time_Finish] between [IHP_Rcp].[Checkin] and [IHP_Rcp].[Checkout] 
                        then
                            [IHP_Rcp_DetailsRoom].[Overpax] 
                        when
                            [IHP_Rcp].[Checkin] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                            and [IHP_Rcp].[Checkout] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                        then
            ([IHP_Rcp_DetailsRoom].[Overpax] / 60)*DATEDIFF(mi, [IHP_Rcp].[Checkin] , [IHP_Rcp].[Checkout] ) 
                        when
                            [IHP_Rcp].[Checkin] between [IHP_Rcp_DetailsRoom].[Time_Start] and [IHP_Rcp_DetailsRoom].[Time_Finish] 
                        then
            ([IHP_Rcp_DetailsRoom].[Overpax] / 60)* DATEDIFF(mi, [IHP_Rcp].[Checkin] , [IHP_Rcp_DetailsRoom].[Time_Finish] ) 
                        when
                            [IHP_Rcp].[Checkout] >= [IHP_Rcp_DetailsRoom].[Time_Start] 
                            and [IHP_Rcp].[Checkout] <= [IHP_Rcp_DetailsRoom].[Time_Finish] 
                        then
            ([IHP_Rcp_DetailsRoom].[Overpax] / 60)* DATEDIFF(mi, [IHP_Rcp_DetailsRoom].[Time_Start], [IHP_Rcp].[Checkout]) 
                        else
                            0 
                        end
                        as Tarif_Overpax_Yang_Digunakan 
                    from
                        [IHP_Rcp] 
                        INNER Join
                        [IHP_Rcp_DetailsRoom] 
                        on [IHP_Rcp].[Reception] = [IHP_Rcp_DetailsRoom].[Reception] 
                    where
                        [IHP_Rcp].[Reception] = '${rcp}'`;

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`can't connect to database\n${err}`);
                    resolve(false);
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`countRoomRate query \n${query}\n${err}`);
                            resolve(false);
                        }else{
                            logger.info(`SUCCESS INSERT IHP_Detail_Sewa_Kamar ${rcp}`);
                            resolve(true);
                        }
                    })
                }
            })

        }catch(err){
            logger.error(`countRoomRate\n${err}`);
            resolve(false);
        }
    });
}

module.exports = { 
    insertRcp,
    insertIvc,
    insertRoomCheckin,
    updateIhpRoom,
    updateIhpRcpAddInvoice,
    getCheckinAndCheckoutTime,
    getRateRoomHourly,
    insertRcpDetailsRoom,
    countRoomRate
}