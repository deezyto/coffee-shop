const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/item');
const Category = require('../models/category');

router.post('/action/category', auth, async (req, res) => {
  try {
    if (req.admin) {
      const category = new Category(req.body);
      await category.save()
      res.status(201).send(category);
    }
    res.status(403).send();
  } catch {
    res.status(400).send();
  }
});

module.exports = router;