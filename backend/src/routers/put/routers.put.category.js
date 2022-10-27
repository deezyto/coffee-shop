const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Category = require('../../models/model.category');

router.put('/update/category/:id', auth, async (req, res) => {
  try {
    if (req.admin) {
      const category = await Category.findById(req.params.id);
      const updates = Object.keys(req.body);
      const allowedFields = ['title', 'description', 'slug', 'metaTags', 'addParentCategories', 'removeParentCategories'];
      const isValidUpdates = updates.every(elem => allowedFields.includes(elem));

      if (!isValidUpdates) {
        return res.status(400).send({err: 'This updates not allowed'});
      }

      const removeParentCategoriesFromCategory = async () => {
        await Category.findByIdAndUpdate(
          req.params.id,
          { $pullAll: { parentCategories: req.body.removeParentCategories } },
          { new: true, useFindAndModify: false }
        );
      }

      const removeCategoryFromParentCategories = async () => {
        req.body.removeParentCategories.forEach(async categoryId => {
          await Category.findByIdAndUpdate(
            categoryId,
            { $pull: { subCategories: req.params.id } },
            { new: true, useFindAndModify: false }
          );
        });
      };
      
      const addParentCategoriesToCategory = async () => {
        await Category.findByIdAndUpdate(
          req.params.id,
          { $addToSet: { parentCategories: req.body.addParentCategories } },
          { new: true, useFindAndModify: false }
        );
      }

      const addCategoryToParentCategories = async () => {
        req.body.addParentCategories.forEach(async categoryId => {
          await Category.findByIdAndUpdate(
            categoryId,
            { $addToSet: { subCategories: req.params.id } },
            { new: true, useFindAndModify: false }
          );
        });
      }

      if (req.body.removeParentCategories) {
        await removeParentCategoriesFromCategory();
        await removeCategoryFromParentCategories();
      } 
      
      if (req.body.addParentCategories) {
        await addParentCategoriesToCategory();
        await addCategoryToParentCategories();
      }

      delete req.body.removeParentCategories;
      delete req.body.addParentCategories;

      updates.forEach(field => {
        category[field] = req.body[field];
      })
      
      await category.save();
      res.send(category);
      
      }
  } catch (e) {
    res.status(500).send({err: e});
  }
});

module.exports = router;