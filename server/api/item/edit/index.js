'use strict';

var express = require('express');
var controller = require('./edit.controller');

var router = express.Router();

router.post('/', controller.index);

module.exports = router;