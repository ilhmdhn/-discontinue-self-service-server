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
                    logger.error(`Error Connect To Database \n ${err}`)
                }else{
                    new sql.Request().query(query, (err, result) =>{
                        if(err){
                            logger.error(`Error Add Cateogry Table Query \n ${err}\n${query}`)
                        }else{
                            logger.info('SUCCESS ADD CATEGORY TABLE')
                        }
                    });
                }
            });
    }catch(err){
        logger.error(`Error createCategoryTable \n ${err}`);
    }
}

const addImageUrlColumnIhpInv = () =>{
    try{
        const query =  `IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'IHP_Inventory' and column_name = 'image_url')
                        BEGIN
                            ALTER TABLE IHP_Inventory add image_url nvarchar(50) null
                        END`

        sql.connect(sqlConfig, err =>{
            if(err){
                logger.error(`Error Connect To Database \n ${err}`)
            }else{
                new sql.Request().query(query, (err, result) =>{
                    if(err){
                        logger.error(`Error Add image_url column IHP_Inventory table Query \n ${err} \n ${query}`)
                    }else{
                        logger.info('SUCCESS ADD COLUMN image_url IHP_Inventory')
                    }
                })
            }
        })
    }catch(err){
        logger.error(`Error addImageUrlColumnIhpInv \n ${err}`);
    }
}

const addRoomGaleryTable = () =>{
    try{
        const query = `IF NOT EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_NAME = 'IHP_Room_gallery') Begin
            CREATE TABLE [dbo].[IHP_Room_Gallery](
                id int IDENTITY(1,1) PRIMARY KEY,
                code_room [varchar](10) NOT NULL,
                image_url [varchar](50),
                UNIQUE (image_url)
            )END`

            sql.connect(sqlConfig, err =>{
                if(err){
                    logger.error(`Error connect to database \n${err}`)
                }else{
                    new sql.Request().query(query, (err, result)=>{
                        if(err){
                            logger.error(`Error addRoomGaleryTable query \n${query}\n${err}`);
                        }else{
                            logger.info('SUCCESS ADD room_gallery TABLE')
                        }
                    });
                }
            });
    }catch(err){
        logger.error(`Error addRoomGaleryTable\n${err}`)
    }
}

module.exports = {
    createCategoryTable,
    addImageUrlColumnIhpInv,
    addRoomGaleryTable
}