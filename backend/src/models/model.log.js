const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["create category", "change category", "remove category",
      "create item", "change item", "remove item", "create user", "change user", "remove user"],
  },
  change: {
    type: String,
    required: true,
    maxLength: [10000, 'Max length for change history must be a 10000 characters']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId(),
    required: true
  }
}, {
  timestamps: true
})

const Log = mongoose.model('Log', logSchema);
module.exports = Log;