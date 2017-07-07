'use strict';

var express = require('express');
var controller = require('./discount.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.post('/', controller.discount);
//router.post('/percentoff', controller.percentoff);
router.put('/:id/percentOff',auth.hasRole('admin'), controller.percentoff);
router.put('/:id/rsOff', auth.hasRole('admin'), controller.rsoff);
router.put('/:id/buyDiscount', auth.hasRole('admin'), controller.buyDiscount);


// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

// router.post('/', auth.hasRole('admin'), controller.show);
// router.put('/:id', auth.hasRole('admin'), controller.update);
// router.patch('/:id', auth.hasRole('admin'), controller.update);
// router.delete('/:id', auth.hasRole('admin'), controller.destroy);


module.exports = router;
