const {response} = require('../util/response-format');
const logger = require('../util/logger');
const {getInitialTransCode, generateReceptionCode, generateInvoiceCode} = require('../util/trans-code');
const {todayMBL, todayDateNumber, transactionDate} = require('../util/date-utils');
const {insertRcp, insertRoomCheckin, updateIhpRoom, insertIvc, updateIhpRcpAddInvoice, getCheckinAndCheckoutTime, getRateRoomHourly, insertRcpDetailsRoom, countRoomRate, insertPromoRcp} = require('../model/insert-checkin');
const {countInvoice} = require('../model/count-invoice');
const {getPromoRoomData, getPromoFoodData} = require('../model/promo-data');
const {getshift, getshiftTemp} = require('../util/get-shift');
const {insertSOL} = require('../model/sliporder-data');

const postCheckinRoom = async(req, res) =>{
        try{

            //checkin varianle
            let rcp = await generateReceptionCode();
            const member_code = req.body.checkin_info.member_code;
            const member_name = req.body.checkin_info.member_name;
            const room_code = req.body.checkin_info.room_code;
            const room_duration = req.body.checkin_info.room_duration;
            const room_type = req.body.checkin_info.room_type;
            const pax = req.body.checkin_info.pax;
            const chusr = req.body.checkin_info.chusr;
            const uang_muka = req.body.checkin_info.uang_muka;
            const QM1 = req.body.checkin_info.QM1;
            const QM2 = req.body.checkin_info.QM2;
            const QM3 = req.body.checkin_info.QM3;
            const QM4 = req.body.checkin_info.QM4;
            const QF1 = req.body.checkin_info.QF1;
            const QF2 = req.body.checkin_info.QF2;
            const QF3 = req.body.checkin_info.QF3;
            const QF4 = req.body.checkin_info.QF4;
            const keterangan = req.body.checkin_info.keterangan;
            const id_payment = req.body.checkin_info.id_payment;
            const uang_voucher = req.body.checkin_info.uang_voucher;
            const reservation = req.body.checkin_info.reservation;
            const invoice_transfer = req.body.checkin_info.invoice_transfer;

            //promo
            let status_promo
            const promo_fnb_state = req.body.promo_info.promo_food.state;
            const promo_room_state = req.body.promo_info.promo_room.state;
            let promo_room_name;
            let promo_fnb_name;

            const shift = await getshift();
            const shiftTemp = await getshiftTemp();
            const dateTrans = await transactionDate(shiftTemp);

            if(req.body.promo_info.state == true){
                status_promo = "2"
            }else{
                status_promo = "1"
            }

            if(promo_fnb_state){
                promo_fnb_name = req.body.promo_info.promo_food.promo_name;
            }

            if(promo_room_state){
                promo_room_name = req.body.promo_info.promo_room.promo_name;
            }

            //so


            const numberDate = await todayDateNumber();
            let isMBL = await todayMBL();
            if(todayMBL){
                isMBL = 1;
            }else{
                isMBL = 2;
            }

            const rcpData ={
                reception: rcp,
                member: member_code,
                name: member_name,
                shift:shift,
                room: room_code,
                duration: room_duration,
                QM1: QM1,
                QM2: QM2,
                QM3: QM3,
                QM4: QM4,
                QF1: QF1,
                QF2: QF2,
                QF3: QF3,
                QF4: QF4,
                PAX: pax,
                keterangan: keterangan,
                uang_muka: uang_muka,
                id_payment: id_payment,
                uang_voucher: uang_voucher,
                chusr: chusr,
                date_trans:dateTrans,
                MBL: isMBL,
                reservation: reservation,
                status_promo: status_promo
            }

             
            const statusInsertRcp = await insertRcp(rcpData);
           
            if(statusInsertRcp){

                const ivc = await generateInvoiceCode();
                const ivcData = {
                    invoice: ivc,
                    shift: shift,
                    rcp: rcp,
                    member_code: member_code,
                    member_name: member_name,
                    room_code: room_code,
                    uang_muka: uang_muka,
                    date_trans: dateTrans,
                    invoice_transfer: invoice_transfer,
                    chusr: chusr,
                    room_type:room_type
                }

                const statusInsertIvc = await insertIvc(ivcData);
                await updateIhpRcpAddInvoice(rcp, ivc);
                if(statusInsertIvc){

                    const statusInsertRoomCheckin = await insertRoomCheckin(room_code, rcp)
                
                    if(statusInsertRoomCheckin){
                        const statusUpdateIhpRoom = await updateIhpRoom(room_code, rcp, member_name, pax, room_duration)
                        if(statusUpdateIhpRoom){
                            const timeCheckinAndCheckout = await getCheckinAndCheckoutTime(rcp);
                            const checkin = timeCheckinAndCheckout[0].checkin;
                            const checkout = timeCheckinAndCheckout[0].checkout;
                            const getRateRoomHourlyData = await getRateRoomHourly(room_type, numberDate, checkin, checkout);
                                if(timeCheckinAndCheckout != false && getRateRoomHourlyData!=false){
                                    for(let i = 0; i<getRateRoomHourlyData.length; i++){
                                    let overpax = parseFloat(getRateRoomHourlyData[i].overpax);
                                    let room_rate = parseFloat(getRateRoomHourlyData[i].tarif);
                                    await insertRcpDetailsRoom(rcp, room_type, numberDate, overpax, room_rate, getRateRoomHourlyData[i].Time_Start_Dmy, getRateRoomHourlyData[i].Time_Finish_Dmy);
                                }

                                const countRoomRateStatus = await countRoomRate(rcp);

                                if(countRoomRateStatus != false){
                                    if(status_promo == "2"){
                                        if(promo_room_state){
                                            const dataPromoRoom = await getPromoRoomData(promo_room_name);
                                            if(dataPromoRoom != false){
                                                const promoData = {
                                                    rcp: rcp,
                                                    promo_name: dataPromoRoom.promo_name,
                                                    duration: room_duration,
                                                    promo_type: 1,
                                                    time_start: dataPromoRoom.time_start,
                                                    time_finish: dataPromoRoom.time_finish,
                                                    discount_percent: dataPromoRoom.discount_percent,
                                                    discount_idr: dataPromoRoom.discount_idr
                                                    }
                                                await insertPromoRcp(promoData);
                                            }
                                        }
                                        if(promo_fnb_state){
                                            const dataPromoFnB = await getPromoFoodData(promo_fnb_name);
                                            if(dataPromoFnB != false){
                                                const promoData = {
                                                    rcp: rcp,
                                                    promo_name: dataPromoFnB.promo_name,
                                                    duration: room_duration,
                                                    promo_type: 2,
                                                    time_start: dataPromoFnB.time_start,
                                                    time_finish: dataPromoFnB.time_finish,
                                                    discount_percent: dataPromoFnB.discount_percent,
                                                    discount_idr: dataPromoFnB.discount_idr
                                                    }
                                                await insertPromoRcp(promoData);
                                            }
                                        }
                                    }
    
                                    //hitung invoice
                                    if(countRoomRateStatus){
                                        const hitungInvoiceStatus = await countInvoice(rcp);
                                        if(hitungInvoiceStatus){
                                                res.send(response(true, null, "Checkin Successfully"));
                                        }

                                    }else{
                                    //fail insert IHP_Detail_Sewa_Kamar
                                    //remove ihp_rcp, ihp_ivc, ihp_roomCheckin, updateIhpRoom
                                    logger.error('fail insert ');
                                    res.send(response(false, null, 'Fail Checkin'));                                                                    
                                    }
                                }

                            }else{
                                //fail get checkin and checkoutpusextends and get rate room hourly
                                //remove ihp_rcp, ihp_ivc, ihp_roomCheckin, updateIhpRoom
                                logger.error('fail get checkin and checkoutpusextends and get rate room hourly');
                                res.send(response(false, null, 'Fail Checkin'));                                
                            }
                        }else{
                            //Fail update IHP_Room
                            //remove ihp_rcp, ihp_ivc, ihp_roomCheckin
                            logger.error('Fail update IHP_Room')
                            res.send(response(false, null, 'Fail Checkin'));                        
                        }
                    }else{
                        //fail IHP_RoomCheckin
                        //remove ihp_rcp, ihp_ivc
                        logger.error('Fail insert ihp_roomCheckin')
                        res.send(response(false, null, 'Fail Checkin'));
                    }

                }else{
                    //Fail insert ihp_ivc
                    //remove ihp_rcp
                    logger.error('Fail Insert ihp_ivc')
                    res.send(response(false, null, 'Fail Checkin'));
                }
            }else{
                //Fail Insert ihp_rcp
                logger.error('Fail Insert ihp_rcp')
                res.send(response(false, null, 'Fail Checkin'));
            }


        }catch(err){
            logger.error(`Error postCheckinRoom\n${err}`);
            res.send(response(false, "", "Sistim Error Checkin Gagal"))
        }
}

module.exports = {
    postCheckinRoom
}