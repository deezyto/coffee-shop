const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');

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

//create item in category or in subcategory
router.post('/create/item', auth, async (req, res) => {
  try {
    if (req.admin) {
      //search item on slug
      const checkUri = await Item.findOne({slug: req.body.slug});
      
      if (checkUri) {
        res.status(400).send({err: `Uri ${req.body.slug} is available. Please choose another unique uri`});
      }

      //create new item
      const item = new Item(req.body);
      await item.save();

      if (req.body.addParentCategories) {
        addItemToCategory(req.body.addParentCategories, item._id);
        addCategoryToItem(req.body.addParentCategories, item._id);
      }
      
      res.status(201).send(item);
    }
    res.status(403).send();
  } catch {
    res.status(400).send({err: 'Please check required fields'});
  }
});

module.exports = router;