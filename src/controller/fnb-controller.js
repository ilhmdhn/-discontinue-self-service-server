const {categoryFnBData, fnbData, fnbDataPaging, fnbDataById} = require('../model/fnb-data');
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

const getFnBPaging = async (req, res)=>{
    try{
        let category = req.query.category;
        let search = req.query.search;
        let page = req.query.page;
        let size = req.query.size;
        
        if(search==undefined||search==null){
            search = ''
        }
        
        if(category == undefined||category == null ||category == ''){
            category=''
        }

        const fnb = await fnbDataPaging(category.trim(), search.trim(), page, size);
        res.send(fnb);
    }catch(err){
        logger.error('Error getFnB', err)
        res.send(response(false, null, 'Error get FnB'))
    }
}

const getFnbById = async(req, res)=>{
    try{
        const kode_Inventory = req.query.kode_inventory;

        if(kode_Inventory == '' || kode_Inventory === null || kode_Inventory === undefined){
            throw 'kode inventory kosong';
        }

        const fnbData = await fnbDataById(kode_Inventory);
        res.send(fnbData)
    }catch(err){
        logger.error('Error getFnbById'+ err)
        res.send(response(false, null, 'Error get FnBById'))
    }
}
module.exports = {
    getCategoryFnB,
    getFnB,
    getFnBPaging,
    getFnbById
}