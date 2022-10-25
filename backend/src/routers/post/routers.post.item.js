const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');

//коли створюється новий item
//потрібно в категорію яку хочеш добавити цей item
//добавити id item, і в item добавити id category
const addItemToCategory = function (categoryId = [], itemId = '') {
  //перебираєм масив з id категорій які має item
  categoryId.forEach(async category => {
    //шукаємо одну із категорій
    await Category.findByIdAndUpdate(
      category,
      //добавляємо створений item
      { $push: { items: itemId } },
      { new: true, useFindAndModify: false }
    );
  });
};

const addCategoryToItem = function (categoryId = [], itemId = '') {
  //перебираємо масив з id категорій які має item
  categoryId.forEach(async id => {
    //при кожному проході категорії з масива
    //шукаємо item в якому повинна бути ця категорія
    await Item.findByIdAndUpdate(
      itemId,
      { $push: { categories: id } },
      { new: true, useFindAndModify: false }
    );
  });
};

//create item in category or in subcategory
router.post('/admin/create/item', auth, async (req, res) => {
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

      addItemToCategory(req.body.categoriesArray, item._id);
      addCategoryToItem(req.body.categoriesArray, item._id);
      
      res.status(201).send(item);
    }
    res.status(403).send();
  } catch {
    res.status(400).send({err: 'Please check required fields'});
  }
});

module.exports = router;