const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');

const addSubCategoryToParentCategory = function (parentCategoriesId = [], subCategoryId = '') {
  parentCategoriesId.forEach(async category => {
    await Category.findByIdAndUpdate(
      category,
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
      const checkUri = await Category.findOne({slug: req.body.slug});
      
      if (checkUri) {
        res.status(400).send({err: `Uri ${req.body.slug} is available. Please choose another unique uri`});
      }

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