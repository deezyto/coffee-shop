const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, 'Min length for title must be a 1 character'],
    maxLength: [100, 'Max length for title must be a 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    minLength: [5, 'Min length for description must be a 5 characters'],
    maxLength: [500, 'Max length for description must be a 500 characters'],
  },
  slug: {
    type: String,
    trim: true,
    require: true,
    lowercase: true,
    minLength: [1, 'Min length for slug must be a 1 characters'],
    maxLength: [100, 'Max length for slug must be a 100 characters']
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
  html: {
    type: String,
    maxLength: [10000, 'Max length for html must be a 10000 characters']
  },
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url'
  },
  mainCategory: {
    type: mongoose.Schema.Types.ObjectId
  },
  subCategories: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  mainItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }]
}, {
  timestamps: true
})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;