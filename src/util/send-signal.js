const dgram = require('dgram');
const e = require('express');
const {getIpAndUdpPortAddress} = require('../model/ipport-data');
const logger = require('./logger');

const sendSignalAfterCheckinSuccessfully = () =>{
    return new Promise(async(resolve)=>{
        try{
            let getAddress;
            let ipAddress;
            let udpPortAddress;
            let port;
            let message;
            let messageLength;

            const clientPOS = dgram.createSocket('udp4');
            const clientVOD2 = dgram.createSocket('udp4');

            message = "FRONT_OFFICE_ROOM_CHECKIN";
            getAddress = await getIpAndUdpPortAddress("POINT OF SALES");
            if (getAddress !== false) {
                
                ipAddress = getAddress.ip_address;
                udpPortAddress = parseInt(getAddress.udp_port_address);
                messageLength = parseInt(message.length);
                logger.info("Send Sinyal FRONT_OFFICE_ROOM_CHECKIN to POINT OF SALES");
                clientPOS.send(message, 0, messageLength, udpPortAddress, ipAddress, (err, bytes) => {
                    if(err){
                        logger.error("Send Sinyal FRONT_OFFICE_ROOM_CHECKIN to POINT OF SALES "+err);                        
                    }else{
                        logger.info("Send Sinyal FRONT_OFFICE_ROOM_CHECKIN to POINT OF SALES SUCCESS");
                        clientPOS.close();
                    }
                });
            }


            message = "TIMER VOD2B";
            getAddress = await getIpAndUdpPortAddress("POINT OF SALES");
            if (getAddress !== false) {
                ipAddress = getAddress.ip_address;
                udpPortAddress = parseInt(getAddress.udp_port_address);
                messageLength = parseInt(message.length);
                logger.info("Send Sinyal TIMER VOD2B to TIMER VOD2B");
                clientVOD2.send(message, 0, messageLength, udpPortAddress, ipAddress, (err, bytes)=> {
                    if(err){
                        logger.error("Send Sinyal TIMER VOD2B to TIMER VOD2B "+err);
                    }else{
                        logger.info("Send Sinyal TIMER VOD2B to TIMER VOD2B SUCCESS");
                        clientVOD2.close();
                    }
                });
            }

            // var server_udp_room_sign = dgram.createSocket('udp4');
            // pesan = "Room " + room + " Checkin";
            // ip_address = await new RoomNoService().getRoomIHPIPAddressRoomNo(db, room);
            // if ((ip_address !== false)) {
            //     ip_address = ip_address.recordset[0].IP_Address;
            //     port = parseInt(7082);
            //     panjang_pesan = pesan.length;
            //     panjang_pesan = parseInt(panjang_pesan);
            //     logger.info("Send Sinyal Checkin to Room Sign " + ip_address);
            //     server_udp_room_sign.send(pesan, 0, panjang_pesan, port, ip_address, function (err, bytes) {
            //         server_udp_room_sign.close();
            //     });
            // }
        resolve(true);
        }catch(err){
            logger.info(`sendSignalAfterCheckinSuccessfully ${err}`);
            resolve(false);
        }
    });
}

module.exports = {
    sendSignalAfterCheckinSuccessfully
}