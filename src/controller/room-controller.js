const {categoryRoomData, roomReadyData} = require("../model/room-data")
const {response} = require('../util/response-format')
const logger = require('../util/logger');

const getCategoryRoom = async(req, res)=>{
    try{
        const categoryRoom = await categoryRoomData();
        res.send(categoryRoom)
    }catch(err){
        logger.error(`Error getCategoryRoom\n${err}\n${err.message}`)
        res.send(response(false, null, err.message))
    }
}

const getRoomAvailable = async(req, res) =>{
    try{
        const categorySelected = req.query.category;

        if(categorySelected == undefined || categorySelected == null || categorySelected == ''){
            res.send(response(false, null, "Room Category Empty"));
            logger.error("Room Category Empty")
            return;
        }

        const roomReady = await roomReadyData(categorySelected)
        res.send(roomReady);
    }catch(err){
        logger.error(`Error getRoomAvailable\n${err}\n${err.message}`)
        res.send(response(false, null, err.message))
    }
}

module.exports = {
    getCategoryRoom,
    getRoomAvailable
}