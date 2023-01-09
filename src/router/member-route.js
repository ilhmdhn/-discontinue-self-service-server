const express = require('express');
const memberRoute = express.Router();
const {getMemberData} = require('../controller/member-controller');

memberRoute.get('/member', getMemberData);

module.exports = memberRoute;