const express = require("express");
const fs = require('fs');
const setup = JSON.parse(fs.readFileSync('setup.json'));
const app = express();
const {connectionDbCheck} = require("./util/db-connection.js")
const logger = require('./util/logger');
const port = setup.server_port;
const path = require("path");


//route
const {roomRoute} = require('./router/room-route.js');
const fnbRoute = require('./router/fnb-route');
const promoRoute = require('./router/promo-route');
const imageRoute = require('./router/image-route');


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
        await createCategoryTable();
        await addImageUrlColumnIhpInv();
        logger.info(`App running on ${port} port`)
    }else{
        logger.info(`App running on ${port} port, but connection to database error`)
    }
})

app.use(loggerRequest)
app.use(addPoweredHeader)

app.get('/', async (req, res) =>{
    const responseData = await connectionDbCheck();
    res.json(responseData);
});

app.get('/image', (req, res) =>{
    res.sendFile(path.join(__dirname,'../assets/room/thor.jpg'))
})

app.use(roomRoute);
app.use(fnbRoute);
app.use(promoRoute);
app.use(imageRoute);