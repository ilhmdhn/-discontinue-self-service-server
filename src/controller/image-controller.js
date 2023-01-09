const fs = require('fs');
const path = require("path");
const {response} = require('../util/response-format')
const logger = require('../util/logger');

const getAssetsImageCategory = async(req, res)=>{
    try{
        let imageName = req.query.name_file;
        if(imageName == undefined || imageName == null || imageName == ""){
            imageName = 'default.png';
        }

        const filePath = path.join(__dirname,`../../assets/fnb_category/${imageName}`);
        
        try {
            await fs.promises.access(filePath);
            res.sendFile(filePath);
        } catch (error) {
            res.sendFile(path.join(__dirname,`../../assets/fnb_category/default.png`));
        }
    }catch(err){
        res.send(response(false, null, "Ada masalah pada server"));
        logger.error("Error getAssetsImageCategory\n"+err);
    }
}

const getAssetsRoomCategory = async(req, res)=>{
    try{
        let imageName = req.query.name_file;
        if(imageName == undefined || imageName == null || imageName == ""){
            imageName = 'default.png';
        }

        const filePath = path.join(__dirname,`../../assets/room_category/${imageName}`);
        try {
            await fs.promises.access(filePath);
            res.sendFile(filePath);
        } catch (error) {
            res.sendFile(path.join(__dirname,`../../assets/room_category/default.png`));
        }
    }catch(err){
        res.send(response(false, null, "Ada masalah pada server"));
        logger.error("Error getAssetsRoomCategory\n"+err);
    }
}

const getAssetsFnB = async(req, res)=>{
    try{
        let imageName = req.query.name_file;
        if(imageName == undefined || imageName == null || imageName == ""){
            imageName = 'default.jpg';
        }

        const filePath = path.join(__dirname,`../../assets/fnb/${imageName}`);
        
        try {
            await fs.promises.access(filePath);
            res.sendFile(filePath);
        } catch (error) {
            res.sendFile(path.join(__dirname,`../../assets/fnb/default.jpg`));
        }
    }catch(err){
        res.send(response(false, null, "Ada masalah pada server"));
        logger.error("Error getAssetsFnB\n"+err);
    }
}

const getAssetsRoom = async(req, res)=>{
    try{
        let imageName = req.query.name_file;
        if(imageName == undefined || imageName == null || imageName == ""){
            imageName = 'default.png';
        }

        const filePath = path.join(__dirname,`../../assets/room/${imageName}`);
        
        try {
            await fs.promises.access(filePath);
            res.sendFile(filePath);
        } catch (error) {
            res.sendFile(path.join(__dirname,`../../assets/room/default.png`));
        }
    }catch(err){
        res.send(response(false, null, "Ada masalah pada server"));
        logger.error("Error getAssetsRoom\n"+err);
    }
}
module.exports = {
    getAssetsImageCategory,
    getAssetsRoomCategory,
    getAssetsFnB,
    getAssetsRoom
}