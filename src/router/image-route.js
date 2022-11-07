const express = require('express');
const {getAssetsImageCategory, getAssetsRoomCategory, getAssetsFnB, getAssetsRoom} = require('../controller/image-controller');

const imageRoute = express.Router();

imageRoute.get('/image-fnb-category', getAssetsImageCategory);
imageRoute.get('/image-room-category', getAssetsRoomCategory);
imageRoute.get('/image-fnb', getAssetsFnB);
imageRoute.get('/image-room', getAssetsRoom);

module.exports = imageRoute;