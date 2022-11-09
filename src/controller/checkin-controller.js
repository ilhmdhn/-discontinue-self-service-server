const {response} = require('../util/response-format');
const logger = require('../util/logger');
const {getInitialTransCode, generateReceptionCode} = require('../util/trans-code');
const {todayMBL} = require('../util/date-utils');
const {insertRcp} = require('../model/insert-checkin');

const postCheckinRoom = async(req, res) =>{
        try{


            let isMBL = await todayMBL()
            if(todayMBL){
                isMBL = 1;
            }else{
                isMBL = 2;
            }

            const rcpData ={
            reception: await generateReceptionCode(),
            member: `000022061122`,
            name: 'Ilham Dohaan',
            shift:1,
            room: 'PR A',
            duration: 3,
            QM1: 1,
            QM2: 1,
            QM3: 1,
            QM4: 1,
            QF1: 1,
            QF2: 1,
            QF3: 1,
            QF4: 1,
            PAX: 8,
            keterangan: '087753900887',
            uang_muka: 100000,
            id_payment: 0,
            uang_voucher: 0,
            chusr:'SELF',
            MBL: isMBL,
            reservation: '',
            status_promo: 1
            }

            const statusInsertRcp = await insertRcp(rcpData);

            console.info(statusInsertRcp)
        }catch(err){
            logger.error(`Error postCheckinRoom\n${err}`)
        }
}

postCheckinRoom()