const express = require("express");
const {getCategoryRoom, getRoomAvailable, getDetailRoom} = require('../controller/room-controller')

const roomRoute = express.Router();

roomRoute.get('/room-category', getCategoryRoom);
roomRoute.get('/room', getRoomAvailable);
roomRoute.get('/room-detail', getDetailRoom);

module.exports = {roomRoute};