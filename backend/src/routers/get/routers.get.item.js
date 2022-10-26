const express = require('express');
const router = new express.Router();
const Item = require('../../models/model.item');
const categoryMiddleware = require('../../middleware/middleware.category');

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
        '_id': {$in: req.category.items}
      }, null, {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      });
      res.send({items, subCategory: req.category.subCategories});
    } else if (req.item) {
      res.status(200).send(req.item);
    }
    
  } catch {
    res.status(500).send()
  }
})

module.exports = router;