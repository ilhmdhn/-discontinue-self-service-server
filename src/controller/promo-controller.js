const {roomPromoData, fnbPromoData} = require('../model/promo-data');
const {response} = require('../util/response-format');
const fs = require('fs');
const axios = require('axios');
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

const getAllVoucherMembership = async(req, res) =>{
    try{
        const memberCode = req.query.kode_member;
        const setup = JSON.parse(fs.readFileSync('setup.json'));

        if(memberCode == '' || memberCode === null || memberCode === undefined){
            res.send(response(false, null, 'Member Code isn\'t define'));
            return
        }

        const apiResponse = await axios.get(`https://ihp-membership.azurewebsites.net/voucher-all?member_code=${memberCode}`, {
            headers:{
                'authorization': setup.auth
            },
            setTimeout: 1
        })

        if(apiResponse.status != 200){
            throw apiResponse.message;
        }

        if(apiResponse.data.state == false){
            throw apiResponse.data.message;
        }

        res.send(response(true, apiResponse.data.data));
    }catch(err){
        res.send(response(false, null, err))
        logger.error("Error getAllVoucherMembership\n"+err)
    }
}

module.exports = {
    getRoomPromo,
    getFnBPromo,
    getAllVoucherMembership
}