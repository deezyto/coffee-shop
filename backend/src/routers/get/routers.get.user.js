const express = require('express');
const {User} = require('../../models/model.user');
const auth = require('../../middleware/middleware.auth');
const router = new express.Router();

router.get('/users', auth, async (req, res) => {
  try {
    if (req.admin) {
      const sort = {};
      if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
      }
      const userLength = await User.find({});
      const user = await User.find({}, null, {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      })
      if (!user.length) {
        res.status(404).send();
      }
      res.send({results: user, length: userLength.length});
    }
  } catch {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;