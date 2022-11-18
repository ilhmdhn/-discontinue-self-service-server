const dgram = require('dgram');
const e = require('express');
const {getIpAndUdpPortAddress, getIpRoom} = require('../model/ipport-data');
const logger = require('./logger');

const sendSignalAfterCheckinSuccessfully = (room_code) =>{
    return new Promise(async(resolve)=>{
        try{
            let getAddress;
            let ipAddress;
            let udpPortAddress;
            let message;
            let port;
            let messageLength;

            const clientPOS = dgram.createSocket('udp4');
            const clientVOD2 = dgram.createSocket('udp4');
            const clientRoomSign = dgram.createSocket('udp4');

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
            getAddress = await getIpAndUdpPortAddress("TIMER VOD2B");
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

            message = `Room ${room_code} Checkin`;
            getAddress = await getIpRoom(room_code);
            if (getAddress !== false) {
                ipAddress = getAddress.ip_address;
                udpPortAddress = parseInt(getAddress.udp_port);
                messageLength = parseInt(message.length);
                logger.info("Send Sinyal Checkin to Room Sign " + ipAddress);
                clientRoomSign.send(message, 0, messageLength, port, ip_address, (err, bytes) => {
                    if(err){
                        logger.info(`Send Signal Checkin to Room Sign ${ipAddress} ERROR\n${err}`);
                    }else{
                        logger.error(`Send Signal Checkin to Room Sign ${ipAddress} SUCCESS}`);
                        clientRoomSign.close();
                    }
                });
            }
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
