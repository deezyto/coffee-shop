const mongoose = require('mongoose');
const validator = require('validator');
const {userModel, userOptions} = require('./model.user');

const orderSchema = new mongoose.Schema({
  ...userModel,
  typeDelivery: {
    type: String,
    trim: true,
    required: true
  },
}, userOptions);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;