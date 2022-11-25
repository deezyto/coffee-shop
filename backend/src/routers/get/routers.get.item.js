const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const categoryMiddleware = require('../../middleware/middleware.category');

router.get('/items', auth, async (req, res) => {
  try {
    if (req.admin) {
      const sort = {};
      if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
      }
      const items = await Item.find({}, null, {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      });

      const countItems = await Item.find({});

      res.send({ results: items, length: countItems.length });
    }
    res.status(403).send();
  } catch {
    res.status(500).send();
  }
});

//get items from category
//get subcategory from category
router.get('*', categoryMiddleware, async (req, res) => {
  try {
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    if (req.category) {
      const items = await Item.find({
        '_id': { $in: req.category.items }
      }, null, {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      });
      res.send({ items, category: req.category });
    } else if (req.item) {
      res.status(200).send(req.item);
    }

  } catch {
    res.status(500).send()
  }
})

module.exports = router;