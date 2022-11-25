const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');
const { findById } = require('../../models/model.item');

const addItemToCategory = function (categoryId = [], itemId = '') {
  categoryId.forEach(async category => {
    await Category.findByIdAndUpdate(
      category,
      { $addToSet: { items: itemId } },
      { new: true, useFindAndModify: false }
    );
  });
};

const addCategoryToItem = function (categoryId = [], itemId = '') {
  categoryId.forEach(async id => {
    await Item.findByIdAndUpdate(
      itemId,
      { $addToSet: { parentCategories: id } },
      { new: true, useFindAndModify: false }
    );
  });
};

//create item in category or subcategory
router.post('/create/item', auth, async (req, res) => {
  try {
    if (req.admin) {
      //search item on slug
      const checkUri = await Item.findOne({ slug: req.body.slug });

      if (checkUri) {
        return res.status(400).send({ err: `Slug ${req.body.slug} is available. Please choose another unique slug` });
      }

      //create new item
      let itemUrl = [];
      const mainCategory = await Category.findById(req.body.mainCategory);
      if (!mainCategory) {
        return res.status(400).send({ err: 'main category not found' });
      }

      let currentMainCategory = mainCategory;

      while (currentMainCategory.mainCategory) {
        itemUrl.unshift(currentMainCategory.slug);
        currentMainCategory = await Category.findById(currentMainCategory.mainCategory);
      }
      itemUrl.unshift('/' + currentMainCategory.slug);
      itemUrl.push(req.body.slug);

      const objItem = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        html: req.body.html,
        metaTags: req.body.metaTags,
        mainCategory: req.body.mainCategory,
        url: itemUrl.join('/')
      }

      const item = new Item(objItem);

      await item.save();

      await Category.findByIdAndUpdate(
        mainCategory._id,
        { $addToSet: { items: item._id } },
        { new: true, useFindAndModify: false }
      );

      if (req.body.parentCategories) {
        addItemToCategory(req.body.parentCategories, item._id);
        addCategoryToItem(req.body.parentCategories, item._id);
      }

      res.status(201).send(item);
    }
    res.status(403).send();
  } catch (e) {
    res.status(400).send({ err: 'Please check required fields', message: e });
  }
});

module.exports = router;