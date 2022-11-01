const express = require("express");
const fs = require('fs');
const setup = JSON.parse(fs.readFileSync('setup.json'));
const app = express();
const {dbConnection} = require("./util/db-connection.js")
const {createCategoryTable} = require('./util/add-table');
const logger = require('./util/logger');
const port = setup.server_port;

const {roomRoute} = require('./router/room-route.js');
const path = require("path");

const loggerRequest = (req, res, next) =>{
    logger.info(`Receive request ${req.method} ${req.originalUrl}`)
    next()
}

const addPoweredHeader = (req, res, next) =>{
    res.set("X-Powered-By", "PT Imperium Happy Puppy")
    next()
}

app.listen(port, async()=>{
    await createCategoryTable();
    logger.info(`App running on ${port} port`)
})

app.use(loggerRequest)
app.use(addPoweredHeader)

app.get('/', async (req, res) =>{
    const responseData = await dbConnection();
    res.json(responseData);
});

app.get('/image', (req, res) =>{
    // res.sendFile(__dirname + '../assets/room/thor.jpg')
    res.sendFile(path.join(__dirname,'../assets/room/thor.jpg'))
})

app.use(roomRoute)