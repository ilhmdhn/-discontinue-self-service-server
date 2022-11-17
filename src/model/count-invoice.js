const logger = require('../util/logger');
const taxService = require('../util/tax-service');
const {getCountRoomRate, getRoomPromo, ihpInvoiceUpdateData, getDownPayment, getTotalSellingFromSO} = require('./invoice-data');

const countInvoice = (rcp) =>{
    return new Promise(async(resolve)=>{
        try{
            const roomRateAndOverpax = await getCountRoomRate(rcp);
            const roomPromoCheck = await getRoomPromo(rcp);
            const downPaymentCheck = await getDownPayment(rcp);
            const downPayment = downPaymentCheck.down_payment;
            const voucherIdr = downPaymentCheck.voucher;
            let roomOverpax = roomRateAndOverpax.room_overpax;
            const roomRate = roomRateAndOverpax.room_rate;
            let discountRoomRatePercent;
            let discountRoomRateIdr;
            let roomDiscount;

            if(roomPromoCheck != false){
                discountRoomRatePercent = roomPromoCheck.percent_discount/100;
                discountRoomRateIdr = roomPromoCheck.idr_discount;
            }else{
                discountRoomRatePercent = 0;
                discountRoomRateIdr = 0;
            }

            roomDiscount = discountRoomRateIdr + (discountRoomRatePercent * roomRate);
            roomOverpax = roomOverpax - (roomOverpax * discountRoomRatePercent);
            let taxRoom = await taxService(rcp);
            let serviceRoom = await taxService(rcp);
            taxRoom = (taxRoom.room_tax/100) * (roomRate-roomDiscount);
            serviceRoom = (serviceRoom.room_percent_service/100) * (roomRate-roomDiscount);

            const fixRoomRate = roomRate + taxRoom + serviceRoom;

            const chargeSelling = await getTotalSellingFromSO(rcp);

            const taxandService = await taxService(rcp);
            const taxFnB = (taxandService.food_tax / 100) * chargeSelling;
            const serviceFnB = (taxandService.food_percent_service / 100) * chargeSelling;
            const totalSelling = chargeSelling + taxFnB + serviceFnB;
            
            const totalAll = fixRoomRate + totalSelling - roomDiscount-downPayment-voucherIdr;
            
            /*
            Sewa Kamar Sebelum Diskon = roomRate
            Diskon_Sewa_Kamar = roomDiscount
            tax_kamar = taxRoom;
            Service_Kamar = serviceRoom
            Charge_Penjualan = chargeSelling
            Service_Penjualan = serviceFnB
            Tax_Penjualan = taxFnB
            Total_Penjualan = totalSelling
            Total_Kamar = fixRoomRate
            Total_All = totalAll
            */



            const ivcData = {
                    rcp: rcp,
                    Sewa_Kamar: roomRate,
                    Total_Extend: 0,
                    Overpax: 0,
                    Discount_Kamar: roomDiscount,
                    Surcharge_Kamar: 0,
                    Service_Kamar: serviceRoom,
                    Tax_Kamar: taxRoom,
                    Total_Kamar: fixRoomRate,
                    Charge_Penjualan: chargeSelling,
                    Total_Cancelation: 0,
                    Discount_Penjualan: 0,
                    Service_Penjualan: serviceFnB,
                    Tax_Penjualan: taxFnB,
                    Total_Penjualan: totalSelling,
                    Charge_Lain: 0,
                    Uang_Muka: downPayment,
                    Uang_Voucher: voucherIdr,
                    Total_All: totalAll,
                    Total_Extend_Sebelum_Diskon: 0,
                    Diskon_Sewa_Kamar: roomDiscount,
                    Diskon_Extend_Kamar: 0,
                    Sewa_Kamar_Sebelum_Diskon: roomRate,
            }

            const statusUpdate = await ihpInvoiceUpdateData(ivcData);

            if(statusUpdate){
                resolve(true);
            }else{
                resolve(false);
            }

        }catch(err){
            logger.error(`countInvoice\n${err}`);
            resolve(false);
        }
    })
}

module.exports= {
    countInvoice
}