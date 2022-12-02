const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = {
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, 'Min length for name must be a 1 character'],
    maxLength: [100, 'Max length for name must be a 100 characters']
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, 'Min length for lastname must be a 1 character'],
    maxLength: [100, 'Max length for lastname must be a 100 characters']
  },
  surname: {
    type: String,
    trim: true,
    maxLength: [100, 'Max length for surname must be a 100 characters']
  },
  dateBirth: {
    type: Date,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
    maxLength: [100, 'Max length for email must be a 100 characters'],
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
    default: "customer"
  },
  gender: {
    type: String,
    trim: true,
    enum: ["male", "female", "other", "unknown"]
  },
  address: {
    type: String,
    trim: true,
    maxLength: [100, 'Max length for Your address must be a 100 characters'],
  },
  phone: {
    type: String,
    trim: true,
    maxLength: [20, 'Max length for Your phone must be a 20 integers'],
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Your phone number is a not valide format');
      }
    }
  },
  postalCode: {
    type: String,
    trim: true,
    maxLength: [50, 'Max length for Your postal code must be a 50 characters'],
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
  ]
};

const userOptions = {
  timestamps: true
};

const userSchema = new mongoose.Schema({ ...userModel, ...userTokens }, userOptions);

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
}

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Enable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Login or email is dont valid');
  }

  return user;
}

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  for (let item in userObject) {
    if (item === '_id' || item === 'tokens' || item === 'password' || item === '__v') {
      delete userObject[item];
    }
  }
  return userObject;
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User, userModel, userOptions, userTokens };