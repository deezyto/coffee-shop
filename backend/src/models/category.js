const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
  },
  uri: {
    type: String,
    trim: true,
    require: true,
    minLength: [5, 'Min length for title must be a 5 characters'],
    maxLength: [100, 'Max length for title must be a 100000 characters']
  },
  items: {
    type: Array,
    unique: true,
    trim: true,
    require: true
  }
}, {
  timestamps: true
})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;