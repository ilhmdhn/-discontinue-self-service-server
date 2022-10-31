const express = require("express");
const fs = require('fs');
const setup = JSON.parse(fs.readFileSync('setup.json'));
const app = express();
const db = require("./util/db-connection.js")

const port = setup.server_port;

app.listen(port, ()=>{
    console.log(`App running on ${port} port`)
})

app.get('/', async (req, res) =>{
    const responseData = await db;
    console.info("isinya "+JSON.stringify(responseData))
    res.json(JSON.stringify(responseData));
});  