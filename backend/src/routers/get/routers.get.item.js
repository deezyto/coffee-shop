const express = require('express');
const router = new express.Router();
const category = require('../../middleware/middleware.category');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');
const categoryMiddleware = require('../../middleware/middleware.category');
const { compareSync } = require('bcryptjs');

//get items from category
//get subcategory from category
router.get('*', categoryMiddleware, async (req, res) => {
  try {
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    const items = await Item.find({
      '_id': {$in: req.category.items}
    }, null, {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort
    });

    res.send({items, subCategory: req.category.subCategories});
  } catch {
    res.status(500).send()
  }
})

module.exports = router;