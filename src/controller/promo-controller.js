const {roomPromoData, fnbPromoData} = require('../model/promo-data');
const {response} = require('../util/response-format');
const logger = require('../util/logger');

const getRoomPromo = async(req, res) =>{
    try{
        const promoRoom = await roomPromoData();
        res.send(promoRoom)
    }catch(err){
        res.send(response(false, null, err));
        logger.error("Error getPromoRoom\n"+err)
    }
}

const getFnBPromo = async(req, res) =>{
    try{
        const promoFood = await fnbPromoData();
        res.send(promoFood);
    }catch(err){
        res.send(response(false, null, err))
        logger.error("Error getFnBPromo\n"+err)
    }
}

module.exports = {
    getRoomPromo,
    getFnBPromo
}