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

const addStoredProcedureJamKenaSewa = () =>{
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
            }else{
                new sql.Request().query(query, (err, result)=>{
                    if(err){
                        logger.error(`Error addStoredProcedureJamKenaSewa query \n${query}\n${err}`);
                    }else{
                        logger.info('SUCCESS ADD jam_kena_sewa procedure');
                    }
                })
            }
        })
    }catch(err){
        logger.error(`ERROR addStoredProcedureJamKenaSewa\n${err}`)
    }
}

module.exports = {
    createCategoryTable,
    addImageUrlColumnIhpInv,
    addRoomGaleryTable,
    addStoredProcedureJamKenaSewa
}