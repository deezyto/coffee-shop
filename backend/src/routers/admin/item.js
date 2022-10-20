const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/auth');
const Item = require('../../models/admin/item');
const {User} = require('../../models/user');

router.post('/coffee', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = new Item(req.body);
      await item.save()
      res.status(201).send(item);
    }
    res.status(403).send();
  } catch {
    res.status(400).send();
  }
});

router.get('/users', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = await User.find({});
      res.send(item);
    }
    res.status(403).send();
  } catch {
    res.status(400).send();
  }
});

module.exports = router;