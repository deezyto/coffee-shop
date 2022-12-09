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
    minLength: [5, 'Min length for description must be a 5 characters'],
    maxLength: [500, 'Max length for description must be a 500 characters'],
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    minLength: [5, 'Min length for slug must be a 5 characters'],
    maxLength: [100, 'Max length for slug must be a 100 characters'],
    required: true
  },
  urlStructureArr: {
    type: Array
  },
  urlStructureObj: {
    type: Object
  },
  mainCategory: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Category'
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
    type: String,
    maxLength: [10000, 'Max length for html must be a 10000 characters']
  }
}, {
  timestamps: true
})

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;