const {categoryRoomData, roomReadyData, roomDetailData, getRoomGalleryData} = require("../model/room-data")
const {response} = require('../util/response-format')
const logger = require('../util/logger');
const {todayDateNumber} = require('../util/date-utils');


const getCategoryRoom = async(req, res)=>{
    try{
        const categoryRoom = await categoryRoomData();
        res.send(categoryRoom)
    }catch(err){
        logger.error(`Error getCategoryRoom\n${err}`)
        res.send(response(false, null, "Category Room Error"))
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

        const date = await todayDateNumber();

        const roomReady = await roomReadyData(categorySelected, date);
        res.send(roomReady);
    }catch(err){
        logger.error(`Error getRoomAvailable\n${err}`)
        res.send(response(false, null, "Error Get Room Data"))
    }
}

const getDetailRoom = async (req, res) =>{
    try{
        const codeRoom = req.query.room_code;
        if(codeRoom == undefined || codeRoom == null || codeRoom == ''){
            res.send(response(false, null, "Room Code Empty"));
            logger.error("Room Category Empty")
            return;
        }

        const date = await todayDateNumber();
        const roomDetail = await roomDetailData(codeRoom, date);
        let roomGallery = await getRoomGalleryData(codeRoom);
        if(roomGallery.length<1){
            roomGallery = [
                {
                    image_url: 'default.png'}
            ]
        }

        const roomData = {
            room_detail: roomDetail,
            room_gallery: roomGallery
        }
        res.send(response(true, roomData));
    }catch(err){
        logger.error(`Error getDetailRoom \n${err}`);
        res.send(response(false, null, 'Server Error'));
    }
}

module.exports = {
    getCategoryRoom,
    getRoomAvailable,
    getDetailRoom
}