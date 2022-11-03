const express = require('express');
const {getCategoryFnB, getFnB} = require('../controller/fnb-controller');

const fnbRoute = express.Router();

fnbRoute.get('/fnb-category', getCategoryFnB);
fnbRoute.get('/fnb', getFnB);

module.exports = fnbRoute;