const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');
const categoryMiddleware = require('../../middleware/middleware.category');

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
router.get('*', categoryMiddleware, async (req, res) => {
  try {
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    let currentCategory = await Category.findOne({ slug: req.params['0'].split('/')[1] });
    while (currentCategory.subCategories) {
      for await (let id of currentCategory.subCategories) {
        const category = await Category.findById(id);
        for await (let subCategoryId of category.subCategories) {
          const category = await Category.findById(subCategoryId);
          console.log(category.slug, category._id)
        }
        console.log(category.slug, category._id)
        currentCategory = category;
      }
    }
    if (req.category) {
      const items = await Item.find({
        '_id': { $in: req.category.items }
      }, null, {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      });
      return res.send({ items, category: req.category });
    } else if (req.item) {
      return res.status(200).send(req.item);
    }
  } catch {
    return res.status(500).send()
  }
})

module.exports = router;