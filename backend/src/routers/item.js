const express = require('express');
const router = new express.Router();
const Item = require('../models/admin/item');

router.get('/coffee', async (req, res) => {
  try {
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }
    const itemLength = await Item.find({});
    const item = await Item.find({}, null, {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort
    })
    if (!item.length) {
      res.status(404).send();
    }
    res.send({results: item, length: itemLength.length});
  } catch {
    res.status(500).send()
  }
});

module.exports = router;