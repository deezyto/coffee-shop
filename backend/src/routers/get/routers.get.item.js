const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const category = require('../../middleware/middleware.category');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');
const { compareSync } = require('bcryptjs');

//get items from category
//get subcategory from category
router.get('/:category', async (req, res) => {

  try {
    console.log(req.params)
    const slug = req.params['0'].split('/').filter(item => item.length !== 0);

    console.log(slug)
    for (let i = slug.length; i > 0; i--) {

    }

    slug.forEach(async (slug, i) => {
      const category = await Category.findOne({slug});

      if (!category) {
        res.status(404).send();
      }
    })

    const category = await Category.findOne({slug: slug[slug.length - 1]});
    if (!category) {
      res.status(404).send();
    }

    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    const items = await Item.find({
      '_id': {$in: category.items}
    }, null, {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort
    });
    //const itemsFromCategories = await Category.findById(category._id).populate("subCategories");
    //const itemsFromCategories = await category.populate("items");
    res.send({items, subCategory: category.subCategories});
  } catch {
    res.status(500).send()
  }
})

//get items from subcategory
router.get('/:category/:subcategory', async (req, res) => {
  try {
    const category = await Category.findOne({slug: req.params.category});
    const items = await Item.find({categories: category._id});
    const itemsFromSubCategories = await Category.findById(category._id).populate("items");
    res.send(itemsFromSubCategories);
  } catch {
    res.status(500).send()
  }
})

module.exports = router;