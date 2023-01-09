const express = require('express');
const {getCategoryFnB, getFnB, getFnBPaging, getFnbById} = require('../controller/fnb-controller');

const fnbRoute = express.Router();

fnbRoute.get('/fnb-category', getCategoryFnB);
fnbRoute.get('/fnb-old', getFnB);
fnbRoute.get('/fnb', getFnBPaging);
fnbRoute.get('/fnb-id', getFnbById);

module.exports = fnbRoute;