const {categoryFnBData, fnbData} = require('../model/fnb-data');
const {response} = require('../util/response-format');
const logger = require('../util/logger');

const getCategoryFnB = async(req, res) =>{
    try{
        const categoryFnb = await categoryFnBData();
        res.send(categoryFnb);
    }catch(err){
        logger.error('Error getCategoryFnb', err)
        res.send(response(false, null, "Error Get FnB Category"));    }
}

const getFnB = async(req, res)=>{
    try{
        const category = req.query.category;
        let search = req.query.search;
        
        if(search==undefined||search==null){
            search = ''
        }
        
        if(category == undefined||category == null ||category == ''){
            res.send(response(false, null, "Category not found"))
            return
        }

        const fnb = await fnbData(category, search.trim());
        res.send(fnb);
    }catch(err){
        logger.error('Error getFnB', err)
        res.send(response(false, null, 'Error get FnB'))
    }
}

module.exports = {
    getCategoryFnB,
    getFnB
}