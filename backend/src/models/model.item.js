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
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    minLength: [5, 'Min length for title must be a 5 characters'],
    maxLength: [100, 'Max length for title must be a 100000 characters'],
    required: true
  },
  url: {
    type: String,
    trim: true,
    require: true,
    uniq: true,
    minLength: [5, 'Min length for url must be a 5 characters']
  },
  mainCategory: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  metaTags: {
    title: {
      type: String,
      minLength: [5, 'Min length for title must be a 5 characters'],
      maxLength: [100, 'Max length for title must be a 100 characters']
    },
    description: {
      type: String,
      minLength: [5, 'Min length for description must be a 5 characters'],
      maxLength: [500, 'Max length for description must be a 500 characters']
    }
  },
  parentCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  html: {
    type: String
  }
}, {
  timestamps: true
})

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;