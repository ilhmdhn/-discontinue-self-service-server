const express = require("express");
const fs = require('fs');
const setup = JSON.parse(fs.readFileSync('setup.json'));
const app = express();
const {connectionDbCheck} = require("./util/db-connection.js")
const logger = require('./util/logger');
const port = setup.server_port;
const path = require("path");
const bodyParser = require('body-parser');

//---------------IMPORT MODIF TABLE--------------
const {
    createCategoryTable,
    addImageUrlColumnIhpInv,
    addRoomGaleryTable,
    addStoredProcedureJamKenaSewa,
    addIHP_Detail_Sewa_KamarTable,
    removeProcedureJam_Kena_Sewa_,
    addSewa_Kamar_Sebelum_DiskonColumnOnIHP_IvcTable,
    addDiskon_Sewa_KamarOnIHP_IvcTable
} = require('./util/add-table');

//---------------IMPORT ROUTER--------------
const {roomRoute} = require('./router/room-route.js');
const fnbRoute = require('./router/fnb-route');
const promoRoute = require('./router/promo-route');
const imageRoute = require('./router/image-route');
const checkinRoute = require('./router/checkin-route');


//---------------CREATE MIDLEWARE--------------
const loggerRequest = (req, res, next) =>{
    logger.info(`Receive request ${req.method} ${req.originalUrl}`)
    next()
}

const addPoweredHeader = (req, res, next) =>{
    res.set("X-Powered-By", "PT Imperium Happy Puppy")
    next()
}

app.listen(port, async()=>{
    if(connectionDbCheck.connected != false){
        createCategoryTable();
        addImageUrlColumnIhpInv();
        addIHP_Detail_Sewa_KamarTable();
        addRoomGaleryTable();
        if(await removeProcedureJam_Kena_Sewa_()){
            addStoredProcedureJamKenaSewa();
        }
        addSewa_Kamar_Sebelum_DiskonColumnOnIHP_IvcTable();
        addDiskon_Sewa_KamarOnIHP_IvcTable();
        logger.info(`App running on ${port} port`);
    }else{
       logger.info(`App running on ${port} port, but connection to database error`);
    }
})

//---------------USE MIDLEWARE--------------
app.use(loggerRequest)
app.use(addPoweredHeader)
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({extended: true}));

//---------------ROUTING--------------
app.get('/', async (req, res) =>{
    const responseData = await connectionDbCheck();
    res.json(responseData);
});
app.use(roomRoute);
app.use(fnbRoute);
app.use(promoRoute);
app.use(imageRoute);
app.use(checkinRoute);