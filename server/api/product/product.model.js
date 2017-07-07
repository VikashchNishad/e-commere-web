'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  sku: String,
  name: String,
  nameLower: String,
  slug: String,
  category: {_id: String, name: String, slug: String, category: String, parentCategory: String, },
  status: String,
  brand: {_id: String, name: String, info: String, slug: String},
  info: String,
  uid: String,
  variants: Array,
  features: Array,
  keyFeatures: Array,
  discount: {
    percentOff: {
      type: Number,
      default: null
    },
    rsOff: {
      type: Number,
     default: null
    },
    buy: {
      number:{
        type: Number,
        default: null
      },
      getfree: {
        type: Number,
        default: null
      }
    }
  },
  active: { type: Boolean, default: true },
  updated: {type: Date, default: Date.now}
}, { versionKey: false });

module.exports = mongoose.model('Product', ProductSchema);

