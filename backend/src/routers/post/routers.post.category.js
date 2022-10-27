const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');

const addSubCategoryToParentCategory = function (parentCategoriesId = [], subCategoryId = '') {
  //перебираєм масив з id parent категорій які має subcategory
  parentCategoriesId.forEach(async category => {
    //шукаємо одну із категорій
    await Category.findByIdAndUpdate(
      category,
      //добавляємо створену субкатегорію
      { $addToSet: { subCategories: subCategoryId } },
      { new: true, useFindAndModify: false }
    );
  });
};

const addParentCategoryToSubCategory = function (parentCategoriesId = [], subCategoryId = '') {
  parentCategoriesId.forEach(async id => {
    await Category.findByIdAndUpdate(
      subCategoryId,
      { $addToSet: { parentCategories: id } },
      { new: true, useFindAndModify: false }
    );
  });
};

router.post('/create/category', auth, async (req, res) => {
  try {
    if (req.admin) {
      const category = new Category(req.body);
      await category.save();
      if (req.body.addParentCategories) {
        addSubCategoryToParentCategory(req.body.addParentCategories, category._id);
        addParentCategoryToSubCategory(req.body.addParentCategories, category._id);
      }
      res.status(201).send(category);
    }
    res.status(403).send();
  } catch {
    res.status(400).send();
  }
});

module.exports = router;