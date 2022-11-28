const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');

const addItemToCategory = function (categoryesIds = [], itemId = '') {
  categoryesIds.forEach(async category => {
    await Category.findByIdAndUpdate(
      category,
      { $addToSet: { items: itemId } },
      { new: true, useFindAndModify: false }
    );
  });
};

const addCategoryToItem = async function (categoryesIds = [], itemId = '') {
  await Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { parentCategories: categoryesIds } },
    { new: true, useFindAndModify: false }
  );
};

//create item in category or subcategory
router.post('/create/item', auth, async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).send();
    }

    //search item on slug
    const checkSlug = await Item.findOne({ slug: req.body.slug });

    if (checkSlug) {
      return res.status(400).send({ err: `Slug ${req.body.slug} is available. Please choose another unique slug` });
    }

    const mainCategory = await Category.findById(req.body.mainCategory);
    if (!mainCategory) {
      return res.status(400).send({ err: 'main category not found' });
    }

    if (req.body.parentCategories) {
      if (!Array.isArray(req.body.parentCategories)) {
        return res.status(400).send({ err: 'Parent category must be a array type' });
      }
      for await (let id of req.body.parentCategories) {
        const category = await Category.findById(id);
        if (!category) {
          return res.status(400).send({ err: `Parent category ${id} not fount` });
        }
      }
      req.body.parentCategories.push(mainCategory._id);
    }

    if (!req.body.parentCategories) {
      req.body.parentCategories = [mainCategory._id];
    }

    //create new item
    let itemUrl = [];
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
      { $addToSet: { mainItems: item._id } },
      { new: true, useFindAndModify: false }
    );

    addItemToCategory(req.body.parentCategories, item._id);
    addCategoryToItem(req.body.parentCategories, item._id);

    return res.status(201).send(item);
  } catch (e) {
    return res.status(500).send({ err: 'Please check required fields', message: e });
  }
});

module.exports = router;