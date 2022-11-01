const sql = require('mssql');
const {sqlConfig} = require('./db-connection');
const logger = require('./logger');

const createCategoryTable = () =>{
    try{
        const query = `IF NOT EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_NAME = 'IHP_inventory_category') Begin
                        CREATE TABLE [dbo].[IHP_Inventory_Category](
                        [code] [smallint] NOT NULL,
                        [category_name] [nvarchar](30) NOT NULL,
                        [image_url] [nvarchar] (50) NULL)end`
        
            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Error Connect To Database \n ${err} \n ${err.message}`)
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error Add Cateogry Table Query \n ${err} \n ${err.message}\n${query}`)
                        }else{
                            logger.info('SUCCESS ADD CATEGORY TABLE')
                        }
                    });
                }
            });
    }catch(err){
        logger.error(`Error createCategoryTable \n ${err} \n ${err.message}`);
    }
}

const addImageUrlColumnIhpInv = () =>{
    try{
        const query = `IF NOT EXISTS (SELECT * FROM sys.columns WHERE  object_id = OBJECT_ID(N'[dbo].[IHP_Inventory]') AND name = 'image_url') Begin
                        ALTER TABLEIHP_Inventory alter column 'image_url' nvarchar(50) null`;
        
    }catch(err){
        logger.error(`Error addImageUrlColumnIhpInv \n ${err} \n ${err.message}`);
    }
}

module.exports = {
    createCategoryTable
}