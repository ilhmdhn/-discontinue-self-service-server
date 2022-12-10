const sql = require('mssql');
const {sqlConfig} = require('./db-connection');
const logger = require('./logger');

const createCategoryTable = () =>{
   return new Promise((resolve) =>{
      try{
         const query = `IF NOT EXISTS (SELECT * FROM information_schema.TABLES WHERE TABLE_NAME = 'IHP_inventory_category') Begin
                         CREATE TABLE [dbo].[IHP_Inventory_Category](
                         [code] [smallint] NOT NULL,
                         [category_name] [nvarchar](30) NOT NULL,
                         [image_url] [nvarchar] (50) NULL)end`
         
             sql.connect(sqlConfig, err =>{
                 if(err){
                     logger.error(`Error Connect To Database \n ${err}`)
                     resolve(false);
                 }else{
                     new sql.Request().query(query, (err, result) =>{
                         if(err){
                           logger.error(`Error Add Cateogry Table Query \n ${err}\n${query}`)
                           resolve(false); 
                        }else{
                           logger.info('SUCCESS ADD CATEGORY TABLE')
                           resolve(true);
                         }
                     });
                 }
             });
     }catch(err){
         logger.error(`Error createCategoryTable \n ${err}`);
         resolve(false);
     }
   });
}

const addImageUrlColumnIhpInv = () =>{
   return new Promise((resolve) =>{
      try{
         const query =  `IF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'IHP_Inventory' and column_name = 'image_url')
                         BEGIN
                             ALTER TABLE IHP_Inventory add image_url nvarchar(50) null
                         END`
 
         sql.connect(sqlConfig, err =>{
             if(err){
               resolve(false);
               logger.error(`Error Connect To Database \n ${err}`)
             }else{
                 new sql.Request().query(query, (err, result) =>{
                     if(err){
                         logger.error(`Error Add image_url column IHP_Inventory table Query \n ${err} \n ${query}`)
                         resolve(false);
                     }else{
                         logger.info('SUCCESS ADD COLUMN image_url IHP_Inventory');
                         resolve(true);
                     }
                 })
             }
         })
     }catch(err){
         logger.error(`Error addImageUrlColumnIhpInv \n ${err}`);
         resolve(false);
      } 
   })
}

const addRoomGaleryTable = () =>{
   return new Promise((resolve) =>{
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
                     resolve(false);
                     logger.error(`Error connect to database \n${err}`)
                 }else{
                     new sql.Request().query(query, (err, result)=>{
                        if(err){
                           logger.error(`Error addRoomGaleryTable query \n${query}\n${err}`);
                           resolve(false);
                         }else{
                           logger.info('SUCCESS ADD room_gallery TABLE')
                           resolve(true);
                        }
                     });
                 }
             });
     }catch(err){
         logger.error(`Error addRoomGaleryTable\n${err}`)
         resolve(false);
     }
   });
}

const addStoredProcedureJamKenaSewa = () =>{
   return new Promise((resolve) =>{
      try{
         const query = `
         CREATE PROCEDURE [dbo].[Jam_Kena_Sewa_] @Type_Room nvarchar(50), @Day nvarchar(1), @Checkin smalldatetime, @Checkout smalldatetime AS 
           BEGIN
              SET
                 dateformat dmy 
                 DECLARE @1word int, @2word int, @3word nvarchar(8), @4word nvarchar(8), @6word nvarchar(8), @Minus int, @Plus int, @TGL nvarchar(2), @Bln nvarchar(2), @Th nvarchar(4), @Awal nvarchar(8), @Akhir nvarchar(8) 
                 SET
                    @1Word = datepart(hh, @Checkin) 
                    SET
                       @2Word = datepart(hh, @Checkout) 
                       SET
                          @TGL = datepart(dd, @checkin) 
                          SET
                             @bln = datepart(mm, @checkin) 
                             SET
                                @th = datepart(yyyy, @checkin) IF @1word = 0 
                                SET
                                   @3Word = Cast(23 AS nvarchar(8)) 
                                   ELSE
                                      SET
                                         @3Word = Cast(@1word - 1 AS nvarchar(8)) IF @2word = 23 
                                         SET
                                            @2word = Cast(0 AS nvarchar(8)) 
                                            ELSE
                                               SET
                                                  @4Word = Cast(@2word + 1 AS nvarchar(8)) IF Len(@3Word) < 2 
                                                  SET
                                                     @3Word = '0' + @3word IF Len(@4Word) < 2 
                                                     SET
                                                        @4Word = '0' + @4word IF @1word > @2Word 
                                                        BEGIN
                                                           SET
                                                              @Awal = 
                                                              (
                                                                 SELECT DISTINCT
                                                                    Time_Start 
                                                                 FROM
                                                                    IHP_Jenis_kamar 
                                                                 WHERE
                                                                    Time_Start like @3Word + '%' 
                                                              )
                                                              SET
                                                                 @6word = 
                                                                 (
                                                                    SELECT DISTINCT
                                                                       Time_Start 
                                                                    FROM
                                                                       IHP_Jenis_kamar 
                                                                    WHERE
                                                                       Time_Start like '00%' 
                                                                 )
                                                                 SET
                                                                    @akhir = 
                                                                    (
                                                                       SELECT DISTINCT
                                                                          Time_Finish 
                                                                       FROM
                                                                          IHP_Jenis_kamar 
                                                                       WHERE
                                                                          time_Finish like @4Word + '%' 
                                                                    )
                                                                    SELECT
                                                                       Nama_kamar,
                                                                       Hari,
                                                                       overpax,
                                                                       tarif,
                                                                       Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) AS Time_Start,
                                                                       CONVERT(VARCHAR(10), Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime), 103) + ' ' + convert(VARCHAR(8), Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime), 14) AS Time_Start_Dmy,
                                                                       CASE
                                                                          WHEN
                                                                             Time_Finish = '00:00:59' 
                                                                          THEN
                                                                             DATEADD(DAY, 1, Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime)) 
                                                                          ELSE
                                                                             Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) 
                                                                       END
                                                                       AS Time_Finish, 
                                                                       CASE
                                                                          WHEN
                                                                             Time_Finish = '00:00:59' 
                                                                          THEN
                                                                             CONVERT(VARCHAR(10), DATEADD(DAY, 1, Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime)), 103) + ' ' + convert(VARCHAR(8), DATEADD(DAY, 1, Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime)), 14) 
                                                                          ELSE
                                                                             CONVERT(VARCHAR(10), Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime), 103) + ' ' + convert(VARCHAR(8), Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime), 14) 
                                                                       END
                                                                       AS Time_Finish_Dmy, Time_Start AS Jam_Start, Time_Finish AS Jam_Finish, '<24:00-server-android' AS Keterangan 
                                                                    FROM
                                                                       IHP_Jenis_kamar 
                                                                    WHERE
                                                                       CAST(Time_Start AS smalldatetime) >= @Awal 
                                                                       AND Nama_kamar = @Type_Room 
                                                                       AND Hari = @Day 
                                                                    UNION
                                                                    SELECT
                                                                       Nama_kamar,
                                                                       Hari,
                                                                       overpax,
                                                                       tarif,
                                                                       (
                                                                          Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) + 1
                                                                       )
                                                                       AS Time_Start,
                                                                       CONVERT(VARCHAR(10), 
                                                                       (
                                                                          Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) + 1
                                                                       )
           , 103) + ' ' + convert(VARCHAR(8), 
                                                                       (
                                                                          Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) + 1
                                                                       )
           , 14) AS Time_Start_Dmy,
                                                                       CASE
                                                                          WHEN
                                                                             Time_Finish = '00:00:59' 
                                                                          THEN
                                                                             DATEADD(DAY, 1, 
                                                                             (
                                                                                Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + 1
                                                                             )
           ) 
                                                                          ELSE
           (Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + 1) 
                                                                       END
                                                                       AS Time_Finish, 
                                                                       CASE
                                                                          WHEN
                                                                             Time_Finish = '00:00:59' 
                                                                          THEN
                                                                             CONVERT(VARCHAR(10), DATEADD(DAY, 1, 
                                                                             (
                                                                                Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + 1
                                                                             )
           ), 103) + ' ' + convert(VARCHAR(8), DATEADD(DAY, 1, 
                                                                             (
                                                                                Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + 1
                                                                             )
           ), 14) 
                                                                          ELSE
                                                                             CONVERT(VARCHAR(10), 
                                                                             (
                                                                                Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + 1
                                                                             )
           , 103) + ' ' + convert(VARCHAR(8), 
                                                                             (
                                                                                Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + 1
                                                                             )
           , 14) 
                                                                       END
                                                                       AS Time_Finish_Dmy, Time_Start AS Jam_Start, Time_Finish AS Jam_Finish, '>24:00-server-android' AS Keterangan 
                                                                    FROM
                                                                       IHP_Jenis_kamar 
                                                                    WHERE
                                                                       CAST(Time_Start AS smalldatetime) >= @6word 
                                                                       AND CAST(Time_Finish AS smalldatetime) <= @Akhir 
                                                                       AND CAST(Time_Start AS smalldatetime) <= @akhir 
                                                                       AND Nama_kamar = @Type_Room 
                                                                       AND Hari = @Day 
                                                        END
                                                        IF @1word <= @2word 
                                                        BEGIN
                                                           IF (@1Word < Cast(@3Word AS int)) 
                                                                    SET
                                                                       @Minus = 1 
                                                                       ELSE
                                                                    SET
                                                                       @Minus = 0 IF (@2Word > Cast(@4Word AS int)) 
                                                                    SET
                                                                       @Plus = 1 
                                                                       ELSE
                                                                    SET
                                                                       @Plus = 0 IF (@Minus = 1) 
                                                                       OR 
                                                                       (
                                                                          @Plus = 1
                                                                       )
                                                                       BEGIN
                                                                    SET
                                                                       @Awal = 
                                                                       (
                                                                          SELECT DISTINCT
                                                                             Time_Start 
                                                                          FROM
                                                                             IHP_Jenis_kamar 
                                                                          WHERE
                                                                             Time_Start like @3Word + '%' 
                                                                       )
                                                                    SET
                                                                       @6word = 
                                                                       (
                                                                          SELECT DISTINCT
                                                                             Time_Start 
                                                                          FROM
                                                                             IHP_Jenis_kamar 
                                                                          WHERE
                                                                             Time_Start like '00%' 
                                                                       )
                                                                    SET
                                                                       @akhir = 
                                                                       (
                                                                          SELECT DISTINCT
                                                                             Time_Finish 
                                                                          FROM
                                                                             IHP_Jenis_kamar 
                                                                          WHERE
                                                                             time_Finish like @4Word + '%' 
                                                                       )
                                                                       SELECT
                                                                          Nama_kamar,
                                                                          Hari,
                                                                          overpax,
                                                                          tarif,
                                                                          (
                                                                             Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) - @minus
                                                                          )
                                                                          AS Time_Start,
                                                                          CONVERT(VARCHAR(10), 
                                                                          (
                                                                             Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) - @minus
                                                                          )
           , 103) + ' ' + convert(VARCHAR(8), 
                                                                          (
                                                                             Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) - @minus
                                                                          )
           , 14) AS Time_Start_Dmy,
                                                                          CASE
                                                                             WHEN
                                                                                Time_Finish = '00:00:59' 
                                                                             THEN
                                                                                DATEADD(DAY, 1, 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) - @Minus
                                                                                )
           ) 
                                                                             ELSE
           (Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + 1) 
                                                                          END
                                                                          AS Time_Finish, 
                                                                          CASE
                                                                             WHEN
                                                                                Time_Finish = '00:00:59' 
                                                                             THEN
                                                                                CONVERT(VARCHAR(10), DATEADD(DAY, 1, 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) - @Minus
                                                                                )
           ), 103) + ' ' + convert(VARCHAR(8), DATEADD(DAY, 1, 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) - @Minus
                                                                                )
           ), 14) 
                                                                             ELSE
                                                                                CONVERT(VARCHAR(10), 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + 1
                                                                                )
           , 103) + ' ' + convert(VARCHAR(8), 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + 1
                                                                                )
           , 14) 
                                                                          END
                                                                          AS Time_Finish_Dmy, Time_Start AS Jam_Start, Time_Finish AS Jam_Finish, '1a if jam_checkin <= jam_checkout-server-android' AS keterangan 
                                                                       FROM
                                                                          IHP_Jenis_kamar 
                                                                       WHERE
                                                                          CAST(Time_Start AS smalldatetime) >= @Awal 
                                                                          AND Nama_kamar = @Type_Room 
                                                                          AND Hari = @Day 
                                                                       UNION
                                                                       SELECT
                                                                          Nama_kamar,
                                                                          Hari,
                                                                          overpax,
                                                                          tarif,
                                                                          (
                                                                             Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) + @plus
                                                                          )
                                                                          AS Time_Start,
                                                                          CONVERT(VARCHAR(10), 
                                                                          (
                                                                             Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) + @plus
                                                                          )
           , 103) + ' ' + convert(VARCHAR(8), 
                                                                          (
                                                                             Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) + @plus
                                                                          )
           , 14) AS Time_Start_Dmy,
                                                                          CASE
                                                                             WHEN
                                                                                Time_Finish = '00:00:59' 
                                                                             THEN
                                                                                DATEADD(DAY, 1, 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @plus
                                                                                )
           ) 
                                                                             ELSE
           (Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @plus) 
                                                                          END
                                                                          AS Time_Finish, 
                                                                          CASE
                                                                             WHEN
                                                                                Time_Finish = '00:00:59' 
                                                                             THEN
                                                                                CONVERT(VARCHAR(10), DATEADD(DAY, 1, 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @plus
                                                                                )
           ), 103) + ' ' + convert(VARCHAR(8), DATEADD(DAY, 1, 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @plus
                                                                                )
           ), 14) 
                                                                             ELSE
                                                                                CONVERT(VARCHAR(10), 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @plus
                                                                                )
           , 103) + ' ' + convert(VARCHAR(8), 
                                                                                (
                                                                                   Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @plus
                                                                                )
           , 14) 
                                                                          END
                                                                          AS Time_Finish_Dmy, Time_Start AS Jam_Start, Time_Finish AS Jam_Finish, '1b if jam_checkin <= jam_checkout-server-android' AS keterangan 
                                                                       FROM
                                                                          IHP_Jenis_kamar 
                                                                       WHERE
                                                                          CAST(Time_Start AS smalldatetime) >= @6word 
                                                                          AND CAST(Time_Finish AS smalldatetime) <= @Akhir 
                                                                          AND CAST(Time_Start AS smalldatetime) <= @akhir 
                                                                          AND Nama_kamar = @Type_Room 
                                                                          AND Hari = @Day 
                                                                       END
                                                                       ELSE
                                                                          BEGIN
                                                                       SET
                                                                          @Awal = 
                                                                          (
                                                                             SELECT DISTINCT
                                                                                Time_Start 
                                                                             FROM
                                                                                IHP_Jenis_kamar 
                                                                             WHERE
                                                                                Time_Start like @3Word + '%' 
                                                                          )
                                                                       SET
                                                                          @Akhir = 
                                                                          (
                                                                             SELECT DISTINCT
                                                                                Time_Finish 
                                                                             FROM
                                                                                IHP_Jenis_kamar 
                                                                             WHERE
                                                                                time_Finish like @4Word + '%' 
                                                                          )
                                                                          SELECT
                                                                             Nama_kamar,
                                                                             Hari,
                                                                             overpax,
                                                                             tarif,
                                                                             (
                                                                                Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) - @Minus
                                                                             )
                                                                             AS Time_Start,
                                                                             CONVERT(VARCHAR(10), 
                                                                             (
                                                                                Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) - @Minus
                                                                             )
           , 103) + ' ' + convert(VARCHAR(8), 
                                                                             (
                                                                                Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Start AS smalldatetime) - @Minus
                                                                             )
           , 14) AS Time_Start_Dmy,
                                                                             CASE
                                                                                WHEN
                                                                                   Time_Finish = '00:00:59' 
                                                                                THEN
                                                                                   DATEADD(DAY, 1, 
                                                                                   (
                                                                                      Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @Plus
                                                                                   )
           ) 
                                                                                ELSE
           (Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @Plus) 
                                                                             END
                                                                             AS Time_Finish, 
                                                                             CASE
                                                                                WHEN
                                                                                   Time_Finish = '00:00:59' 
                                                                                THEN
                                                                                   CONVERT(VARCHAR(10), DATEADD(DAY, 1, 
                                                                                   (
                                                                                      Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @Plus
                                                                                   )
           ), 103) + ' ' + convert(VARCHAR(8), DATEADD(DAY, 1, 
                                                                                   (
                                                                                      Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @Plus
                                                                                   )
           ), 14) 
                                                                                ELSE
                                                                                   CONVERT(VARCHAR(10), 
                                                                                   (
                                                                                      Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @Plus
                                                                                   )
           , 103) + ' ' + convert(VARCHAR(8), 
                                                                                   (
                                                                                      Cast(@tgl + '/' + @Bln + '/' + @th + ' ' + Time_Finish AS smalldatetime) + @Plus
                                                                                   )
           , 14) 
                                                                             END
                                                                             AS Time_Finish_Dmy, Time_Start AS Jam_Start, Time_Finish AS Jam_Finish, '1c if jam_checkin <= jam_checkout-server-android' AS keterangan 
                                                                          FROM
                                                                             IHP_Jenis_kamar 
                                                                          WHERE
                                                                             CAST(Time_Start AS smalldatetime) >= @Awal 
                                                                             AND CAST(Time_Finish AS smalldatetime) <= @Akhir 
                                                                             AND CAST(Time_Start AS smalldatetime) <= @Akhir 
                                                                             AND Nama_kamar = @Type_Room 
                                                                             AND Hari = @Day 
                                                                          END
                                                        END
           END
         `;
 
         sql.connect(sqlConfig, err =>{
             if(err){
               logger.error(`Error connect to database \n${err}`)
               resolve(false);
             }else{
                 new sql.Request().query(query, (err, result)=>{
                     if(err){
                        logger.error(`Error addStoredProcedureJamKenaSewa query \n${query}\n${err}`);
                        resolve(false);
                     }else{
                        logger.info('SUCCESS ADD jam_kena_sewa procedure');
                        resolve(true);
                     }
                 })
             }
         })
     }catch(err){
         logger.error(`ERROR addStoredProcedureJamKenaSewa\n${err}`)
         resolve(false);
      }
   });
}

const addIHP_Detail_Sewa_KamarTable = () =>{
   return new Promise((resolve) =>{
      try{
         const query = `IF NOT EXISTS (SELECT * FROM information_schema.TABLES where TABLE_NAME = 'IHP_Detail_Sewa_Kamar') BEGIN 
         CREATE TABLE [dbo].[IHP_Detail_Sewa_Kamar]( 
         [Reception] [nvarchar](20) NULL, 
         [Kamar] [nvarchar](30) NULL, 
         [Hari] [smallint] NULL, 
         [Overpax] [Float] NULL, 
         [Tarif] [Float] NULL, 
         [Date_Time_Start] [Datetime] NULL, 
         [Date_Time_Finish] [Datetime] NULL, 
         [Menit_Yang_Digunakan] [int] NULL,
         [Tarif_Kamar_Yang_Digunakan] [Float] NULL, 
         [Tarif_Overpax_Yang_Digunakan] [Float] NULL 
         ) 
         END`;
   
         sql.connect(sqlConfig, err=>{
            if(err){
               logger.error(`can't connect to database\n${err}`);
               resolve(false);
            }else{
               new sql.Request().query(query, (err, result)=>{
                  if(err){
                     logger.error(`addIHP_Detail_Sewa_KamarTable query \n${query}\n${err}`);
                     resolve(false);
                  }else{
                     logger.info('SUCCESS AD TABLE IHP_Detail_Sewa_Kamar');
                     resolve(true);
                  }
               });
            }
         })
    
      }catch(err){
         logger.error('addIHP_Detail_Sewa_KamarTable\n'+err);
         resolve(false);
      }
   });
}

const removeProcedureJam_Kena_Sewa_ = () =>{
   return new Promise((resolve)=>{
      try{
         const query =
       `IF EXISTS (SELECT name FROM  sysobjects WHERE name = 'Jam_Kena_Sewa_' AND type = 'P')
      DROP PROCEDURE Jam_Kena_Sewa_`;
   
      sql.connect(sqlConfig, err=>{
         if(err){
            resolve(false);
            logger.error(`can't connect to database\n${err}`);
            resolve(false);
         }else{
            new sql.Request().query(query, (err, result)=>{
               if(err){
                  logger.error(`removeProcedureJam_Kena_Sewa_ query \n${query}\n${err}`);
                  resolve(false);
               }else{
                  logger.info('SUCCESS REMOVE Jam_Kena_Sewa_');
                  resolve(true);
               }
            });
         }
      })

   }catch(err){
      logger.error(`removeProcedureJam_Kena_Sewa_\n${err}`);
      resolve(false);
   }
   })
}

const addSewa_Kamar_Sebelum_DiskonColumnOnIHP_IvcTable = () =>{
   return new Promise((resolve) =>{
      try{
         const query = `
         IF NOT EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='IHP_Ivc' AND COLUMN_NAME ='Sewa_Kamar_Sebelum_Diskon')
         BEGIN
            ALTER TABLE IHP_Ivc ADD Sewa_Kamar_Sebelum_Diskon [float] NULL
         END
         `
         sql.connect(sqlConfig, err=>{
            if(err){
               logger.error(`can't connect to database\n${err}`);
               resolve(false);
            }else{
               new sql.Request().query(query, (err, result)=>{
                  if(err){
                     logger.error(`addSewa_Kamar_Sebelum_DiskonColumnOnIHP_IvcTable query \n${query}\n${err}`);
                     resolve(false);
                  }else{
                     logger.info('SUCCESS ADD Sewa_Kamar_Sebelum_Diskon COLUMN');
                     resolve(true);
                  }
               });
            }
         });
      }catch(err){
         logger.error(`addSewa_Kamar_Sebelum_DiskonColumnOnIHP_IvcTable\n${err}`);
         resolve(false);
      } 
   })
}

const addDiskon_Sewa_KamarOnIHP_IvcTable = () =>{
   return new Promise((resolve) =>{
      try{
         const query = `IF NOT EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='IHP_Ivc' AND COLUMN_NAME ='Diskon_Sewa_Kamar')
         BEGIN
         ALTER TABLE IHP_Ivc ADD Diskon_Sewa_Kamar [float] NULL
         END`
   
         sql.connect(sqlConfig, err=>{
            if(err){
               logger.error(`can't connect to database\n${err}`);
               resolve(false);
            }else{
               new sql.Request().query(query, (err, result)=>{
                  if(err){
                     logger.error(`addDiskon_Sewa_KamarOnIHP_IvcTable query \n${query}\n${err}`);
                     resolve(false);
                  }else{
                     logger.info('SUCCESS ADD Diskon_Sewa_Kamar COLUMN');
                     resolve(true);
                  }
               });
            }
         });
      }catch(err){
         logger.error(`addDiskon_Sewa_KamarOnIHP_IvcTable\n${err}`);
         resolve(false);
      } 
   })
}

const addIHP_RoomCategoryTable = () =>{
   return new Promise((resolve) =>{
      try{
         const query = `IF NOT EXISTS (SELECT * FROM information_schema.TABLES where TABLE_NAME = 'IHP_RoomCategory') BEGIN 
         CREATE TABLE [dbo].[IHP_RoomCategory](
         [category_name] [nvarchar](30),
         [category_code] [nvarchar](30) PRIMARY KEY NOT NULL,
         [capacity] [int] NULL,
         [category_image] [nvarchar](30) NULL, 
         )
         END`;
   
         sql.connect(sqlConfig, err=>{
            if(err){
               logger.error(`can't connect to database\n${err}`);
               resolve(false);
            }else{
               new sql.Request().query(query, (err, result)=>{
                  if(err){
                     logger.error(`addIHP_RoomCategoryTable query \n${query}\n${err}`);
                     resolve(false);
                  }else{
                     logger.info('SUCCESS AD TABLE IHP_RoomCategoryTable');
                     resolve(true);
                  }
               });
            }
         })
    
      }catch(err){
         logger.error('addIHP_RoomCategoryTable\n'+err);
         resolve(false);
      }
   });
}
module.exports = {
    createCategoryTable,
    addImageUrlColumnIhpInv,
    addRoomGaleryTable,
    addStoredProcedureJamKenaSewa,
    addIHP_Detail_Sewa_KamarTable,
    removeProcedureJam_Kena_Sewa_,
    addSewa_Kamar_Sebelum_DiskonColumnOnIHP_IvcTable,
    addDiskon_Sewa_KamarOnIHP_IvcTable,
    addIHP_RoomCategoryTable
}