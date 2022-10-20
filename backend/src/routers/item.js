const express = require('express');
const router = new express.Router();
const Item = require('../models/admin/item');

router.get('/coffee', async (req, res) => {
  try {
    const item = await Item.find({});
    res.send(item);
  } catch {
    res.status(500).send()
  }
});

module.exports = router;