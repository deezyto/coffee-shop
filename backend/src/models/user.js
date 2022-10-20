const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = {
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    trim: true,
  },
  dateBirth: {
    type: Date,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email dont valid');
      }
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: [8, 'Password must be more 8 characters'],
    maxlength: [100, 'Password must be mach 100 characters'],
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error('Password must be strong (min length 8 symbols and includes lowercase, uppercase and special characters)');
      }
    }
  },
  role: {
    type: String,
    trim: true,
    required: true,
    minLength: [5, 'Min length for user role must be a 5 characters'],
    maxLength: [20, 'Max length for user role must be a 20 characters'],
    validate(value) {
      const arr = ['customer', 'manager', 'support'];
      const result = [value].every(item => arr.includes(item));
      if (!result) {
        throw new Error('This role in not allowed');
      }
    }
  },
  gender: {
    type: String,
    trim: true,
    minLength: [3, 'Min length for Your gender must be a 3 characters']
  },
  address: {
    type: String,
    trim: true,
    maxLength: [100, 'Max length for Your address must be a 100 characters'],
  },
  phone: {
    type: String,
    trim: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Your phone number is a not valide format');
      }
    }
  },
  postalCode: {
    type: String,
    trim: true,
    validate(value) {
      if (!validator.isPostalCode(value)) {
        throw new Error('Your postal code dont correct format');
      }
    }
  }
}

const userTokens = {
  tokens: [
  {
    token: {
      type: String,
      required: true
    }
  }
]};

const userOptions = {
  timestamps: true
};

const userSchema = new mongoose.Schema({...userModel, ...userTokens}, userOptions);

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({_id: this._id.toString()}, 'mNuV9FH5Wd2xPcSzuirWpZGiPrExbUq');
  this.tokens = this.tokens.concat({token});
  await this.save();
  return token;
}

userSchema.statics.findByCredentials = async function(email, password) {
  const user = await User.findOne({email});
  
  if (!user) {
    throw new Error('Enable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Login or email is dont valid');
  }

  return user;
}

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();

  for (let item in userObject) {
    if (item === '_id' || item === 'tokens' || item === 'password' || item === '__v') {
      delete userObject[item];
    }
  }
  return userObject;
}

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  console.log(this, 'save')
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = {User, userModel, userOptions, userTokens};