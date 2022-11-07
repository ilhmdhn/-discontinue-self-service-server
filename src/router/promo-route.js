const express = require("express");
const {getRoomPromo, getFnBPromo}= require('../controller/promo-controller')

const promoRoute = express.Router();

promoRoute.get('/promo/room', getRoomPromo);
promoRoute.get('/promo/fnb', getFnBPromo);

module.exports = promoRoute;