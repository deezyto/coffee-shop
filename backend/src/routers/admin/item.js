const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/auth');
const Item = require('../../models/admin/item');

router.post('/admin/items', auth, async (req, res) => {
  try {
    if (req.admin) {
      const item = new Item(req.body);
      await item.save()
      res.status(201).send(item);
    }
    res.status(403).send();
  } catch {
    res.status(400).send()
  }
});

module.exports = router;