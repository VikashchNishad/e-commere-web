'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DashboardSchema = new Schema({
  type1: int,
  type2: int,
  type3: int
});


module.exports = mongoose.model('Discount', DiscountSchema);
