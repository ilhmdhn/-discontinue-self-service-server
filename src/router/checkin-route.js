const express = require('express');
const {postCheckinRoom} = require('../controller/checkin-controller');
const checkinRoute = express.Router();

checkinRoute.post('/checkin', postCheckinRoom);

module.exports = checkinRoute;