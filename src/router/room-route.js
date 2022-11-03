const express = require("express");
const {getCategoryRoom, getRoomAvailable} = require('../controller/room-controller')

const roomRoute = express.Router();

roomRoute.get('/room-category', getCategoryRoom)
roomRoute.get('/room', getRoomAvailable)

module.exports = {roomRoute};