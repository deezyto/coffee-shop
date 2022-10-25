const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
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
    require: true,
    minLength: [5, 'Min length for title must be a 5 characters'],
    maxLength: [100, 'Max length for title must be a 100000 characters']
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
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    //створюєм посилання на модель користувача
    ref: 'Item'
  }]
}, {
  timestamps: true
})

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;