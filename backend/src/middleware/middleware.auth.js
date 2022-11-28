const jwt = require('jsonwebtoken');
const { User } = require('../models/model.user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const check = jwt.verify(token, 'mNuV9FH5Wd2xPcSzuirWpZGiPrExbUq');
    const user = await User.findOne({ _id: check._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }
    if (user.role === 'admin') {
      req.admin = true;
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).send('Please authenticate');
  }
}

module.exports = auth;