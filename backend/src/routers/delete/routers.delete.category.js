const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/middleware.auth');
const Item = require('../../models/model.item');
const Category = require('../../models/model.category');

router.delete('/delete/category/:id', auth, async (req, res) => {
  try {
    if (req.admin) {
      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(404).send();
      }

      if (category.parentCategories.length) {
        category.parentCategories.forEach(async parentCategory => {
          await Category.findByIdAndUpdate(
            parentCategory,
            {$pull: {subCategories: req.params.id } },
            {new: true, useFindAndModify: false}
          )
        });
      }

      if (category.subCategories.length) {
        category.subCategories.forEach(async subCategory => {
          await Category.findByIdAndUpdate(
            subCategory,
            {$pull: {parentCategories: req.params.id } },
            {new: true, useFindAndModify: false}
          )
        });
      }

      if (category.items.length) {
        category.items.forEach(async item => {
          await Item.findByIdAndUpdate(
            item,
            { $pull: {parentCategories: req.params.id} },
            {new: true, useFindAndModify: false}
          )
        })
      }

      category.remove();
      res.send(category);
    }
    
  } catch {
    res.status(400).send();
  }
});

module.exports = router;