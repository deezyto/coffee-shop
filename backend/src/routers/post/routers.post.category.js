const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');

router.post('/create/category', auth, async (req, res) => {
  try {
    if (req.admin) {
      const category = new Category(req.body);
      await category.save()
      res.status(201).send(category);
    }
    res.status(403).send();
  } catch {
    res.status(400).send();
  }
});

const addSubCategoryToParentCategory = function (parentCategoriesId = [], subCategoryId = '') {
  //перебираєм масив з id parent категорій які має subcategory
  parentCategoriesId.forEach(async category => {
    //шукаємо одну із категорій
    await Category.findByIdAndUpdate(
      category,
      //добавляємо створену субкатегорію
      { $push: { subCategories: subCategoryId } },
      { new: true, useFindAndModify: false }
    );
  });
};

const addParentCategoryToSubCategory = function (parentCategoriesId = [], subCategoryId = '') {
  parentCategoriesId.forEach(async id => {
    await Category.findByIdAndUpdate(
      subCategoryId,
      { $push: { parentCategories: id } },
      { new: true, useFindAndModify: false }
    );
  });
};

//body
//for parent subcategory:
//categoriesArray: [category1, category2]
//for subcategory:
//title, desc
router.post('/create/subcategory', auth, async (req, res) => {
  try {
    if (req.admin) {
      const category = new Category(req.body);
      await category.save();
      addSubCategoryToParentCategory(req.body.categoriesArray, category._id);
      addParentCategoryToSubCategory(req.body.categoriesArray, category._id);
      res.status(201).send(category);
    }
    res.status(403).send();
  } catch {
    res.status(400).send();
  }
});

module.exports = router;