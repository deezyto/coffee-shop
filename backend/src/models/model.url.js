const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [1, 'Min length for url must be a 1 character'],
    maxLength: [100, 'Max length for url must be a 100 characters'],
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId
  },
  firstAndLastSlug: {
    type: String
  },
  urlStructureArr: {
    type: Array
  },
  urlStructureObj: {
    type: Object
  }
}, {
  timestamps: true
})

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;