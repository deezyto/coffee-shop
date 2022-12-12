const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');
const Item = require('../../models/model.item');
const Url = require('../../models/model.url');
const checkUrl = require('../../middleware/middleware.url');

router.get('/items', auth, async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).send();
    }

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

    return res.send({ results: items, length: countItems.length });
  } catch {
    return res.status(500).send();
  }
});

//get items from category
//get subcategory from category
router.get('*', checkUrl, async (req, res) => {
  try {
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    const url = await Url.findById(req.category.url);

    const items = await Item.find({
      url
    }, null, {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort
    });
    if (req.category) {
      req.category.url = url;
    }
    if (req.item) {
      req.item.url = url;
      return res.send({ item: req.item, category: req.category });
    }

    return res.send({ items: items, category: req.category });

  } catch {
    return res.status(500).send()
  }
})

module.exports = router;