const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    console.log(req, 'auth')
    const token = req.header('Authorization').replace('Bearer ', '');
    const check = jwt.verify(token, 'mNuV9FH5Wd2xPcSzuirWpZGiPrExbUq');
    const user = await User.findOne({_id: check._id, 'tokens.token': token});
    console.log(user, 'auth', check)
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send('Please authenticate');
  }
}

module.exports = auth;