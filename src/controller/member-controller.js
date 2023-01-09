const axios = require('axios');
const fs = require('fs');
const {response} = require('../util/response-format')
const logger = require('../util/logger');

const getMemberData = async (req, res) =>{
    try{
        const setup = JSON.parse(fs.readFileSync('setup.json'));
        const memberCode = req.query.member_code;



        if(memberCode == '' || memberCode === null || memberCode === undefined){
            res.send(response(false, null, 'Member Code isn\'t define'));
            return
        }

        const apiResponse = await axios.get(`https://ihp-membership.azurewebsites.net/member-info?member_code=${memberCode}`, {
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
        logger.error(err)
        res.send(response(false, null, err))
    }
}

module.exports = {
    getMemberData
}