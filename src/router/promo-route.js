const express = require("express");
const {getRoomPromo, getFnBPromo, getAllVoucherMembership}= require('../controller/promo-controller')

const promoRoute = express.Router();

promoRoute.get('/promo/room', getRoomPromo);
promoRoute.get('/promo/fnb', getFnBPromo);
promoRoute.get('/voucher-membership', getAllVoucherMembership);

module.exports = promoRoute;