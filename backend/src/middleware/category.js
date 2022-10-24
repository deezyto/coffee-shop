
const category = async (req, res, next) => {
  try {
    console.log(req.params, 'category');
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
    res.status(401).send('Please authenticate');
  }
}

module.exports = category;