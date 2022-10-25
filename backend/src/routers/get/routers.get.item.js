const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const category = require('../../middleware/middleware.category');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');
const SubCategory = require('../../models/model.subcategory');

//get items from category
//get subcategory from category
router.get('/:category', async (req, res) => {
  try {
    const category = await Category.findOne({slug: req.params.category});
    const items = await Item.find({categories: category._id});
    const itemsFromCategories = await Category.findById(category._id).populate("items");
    res.send(itemsFromCategories);
  } catch {
    res.status(500).send()
  }
})

//get items from subcategory
router.get('/:category/:subcategory', async (req, res) => {
  try {
    const category = await SubCategory.findOne({slug: req.params.category});
    const items = await Item.find({categories: category._id});
    const itemsFromSubCategories = await SubCategory.findById(category._id).populate("items");
    res.send(itemsFromSubCategories);
  } catch {
    res.status(500).send()
  }
})

module.exports = router;