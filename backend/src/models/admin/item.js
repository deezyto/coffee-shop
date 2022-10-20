const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: [5, 'Min length for title must be a 5 characters'],
    maxLength: [100, 'Max length for title must be a 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    minLength: [5, 'Min length for title must be a 5 characters'],
    maxLength: [100000, 'Max length for title must be a 100000 characters'],
  }
}, {
  timestamps: true
})

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;