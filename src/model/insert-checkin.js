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
                reject(`Can't connect to database ${err}`);
            }else{
                new sql.Request().query(query, (err, result)=>{
                    if(err){
                        reject(`insert ihp rcp query \n${query}\n${err}`)
                    }else{
                        resolve(true)
                    }
                })
            }
        })
        }catch(err){
            reject(`Error insertRcp \n${err}`);
        }
    });
}

module.exports = { 
    insertRcp
}